from __future__ import annotations

import subprocess
from dataclasses import dataclass
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from macos_system_daemons import MACOS_PROBABLY_KNOWN_SYSTEM_DAEMONS
from storage import save_snapshot, get_snapshot_list, get_snapshot, cleanup_old_snapshots


# Example usage
def is_known_system_process(path_or_name: str) -> bool:
	return path_or_name in MACOS_PROBABLY_KNOWN_SYSTEM_DAEMONS

# Extremely fast — frozenset lookup is basically instant
if is_known_system_process("/sbin/launchd"):
	print("Safe system daemon")


app = FastAPI(title="System Info API")


# ======================
# Data Models
# ======================

@dataclass
class LsofEntry:
	command: str
	pid: str
	user: str
	fd: str
	type: str
	device: str
	size_offset: str
	node: str
	name: str


@dataclass
class ProcessEntry:
	pid: str
	cmd: str
	safe: str


class LsofResponse(BaseModel):
	connections: List[dict]


class ProcessListResponse(BaseModel):
	process_list: List[dict]


# ======================
# Parsers
# ======================

def parse_lsof_output(output: str) -> List[LsofEntry]:
	entries = []
	lines = output.strip().splitlines()

	for line in lines:
		if not line or line.startswith("COMMAND"):
			continue

		fields = line.split(maxsplit=8)  # Only split into 9 parts max
		if len(fields) < 9:
			continue  # Malformed line

		name = fields[8] if len(fields) > 8 else ""
		entries.append(LsofEntry(
			command=fields[0],
			pid=fields[1],
			user=fields[2],
			fd=fields[3],
			type=fields[4],
			device=fields[5],
			size_offset=fields[6],
			node=fields[7],
			name=name,
		))

	return entries

	
def parse_ps_output(output: str) -> List[ProcessEntry]:
	entries = []
	lines = output.strip().splitlines()

	for line in lines:
		if not line or line.startswith("PID"):
			continue

		fields = line.split(maxsplit=3)  # PID TTY TIME CMD → we want CMD as rest
		if len(fields) < 4:
			continue

		#print(fields[3])
		#print(is_known_system_process(fields[3]))
		entries.append(ProcessEntry(
			pid=fields[0],
			cmd=fields[3],
			safe=is_known_system_process(fields[3])
		))

	return entries


# ======================
# Helper to run commands safely
# ======================

def run_command(cmd: List[str]) -> str:
	try:
		result = subprocess.run(
			cmd,
			capture_output=True,
			text=True,
			check=True,
			timeout=30,
		)
		return result.stdout
	except subprocess.CalledProcessError as e:
		raise HTTPException(status_code=500, detail=f"Command failed: {e}")
	except subprocess.TimeoutExpired:
		raise HTTPException(status_code=500, detail="Command timed out")
	except FileNotFoundError:
		raise HTTPException(status_code=500, detail=f"Command not found: {' '.join(cmd)}")


# ======================
# Routes
# ======================

@app.get("/", tags=["info"])
def root():
	return {"message": "System info server is running", "endpoints": ["/lsof_endpoint", "/ps_endpoint"], "timestamp": datetime.now().isoformat()}


@app.get("/lsof_endpoint", response_model=LsofResponse, tags=["system"])
def get_lsof_connections():
	output = run_command(["lsof", "-Pni"])
	connections = parse_lsof_output(output)

	response_data = {
		"timestamp": datetime.now().isoformat(),
		"connections": [
			{
				"command": c.command,
				"pid": c.pid,
				"user": c.user,
				"fd": c.fd,
				"type": c.type,
				"device": c.device,
				"size_offset": c.size_offset,
				"node": c.node,
				"name": c.name,
			}
			for c in connections
		]
	}

	# Auto-save snapshot and cleanup old ones
	save_snapshot("lsof", response_data)
	cleanup_old_snapshots("lsof", keep_count=10)

	return response_data


@app.get("/ps_endpoint", response_model=ProcessListResponse, tags=["system"])
def get_process_list():
	output = run_command(["ps", "-A"])
	processes = parse_ps_output(output)

	response_data = {
		"timestamp": datetime.now().isoformat(),
		"process_list": [
			{"pid": p.pid, "cmd": p.cmd, "safe": p.safe}
			for p in processes
		]
	}

	# Auto-save snapshot and cleanup old ones
	save_snapshot("ps", response_data)
	cleanup_old_snapshots("ps", keep_count=10)

	return response_data


# ======================
# History Routes
# ======================

@app.get("/history/ps", tags=["history"])
def get_ps_history():
	"""Get list of all ps snapshots."""
	return {"snapshots": get_snapshot_list("ps")}


@app.get("/history/lsof", tags=["history"])
def get_lsof_history():
	"""Get list of all lsof snapshots."""
	return {"snapshots": get_snapshot_list("lsof")}


@app.get("/history/ps/{timestamp}", tags=["history"])
def get_ps_snapshot(timestamp: str):
	"""Get specific ps snapshot by timestamp."""
	data = get_snapshot("ps", timestamp)
	if data is None:
		raise HTTPException(status_code=404, detail=f"Snapshot not found: {timestamp}")
	return data


@app.get("/history/lsof/{timestamp}", tags=["history"])
def get_lsof_snapshot(timestamp: str):
	"""Get specific lsof snapshot by timestamp."""
	data = get_snapshot("lsof", timestamp)
	if data is None:
		raise HTTPException(status_code=404, detail=f"Snapshot not found: {timestamp}")
	return data