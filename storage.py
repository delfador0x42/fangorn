"""
JSON file storage for historical snapshots.
Stores ps and lsof endpoint data with automatic cleanup.
"""
from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import List, Optional

DATA_DIR = Path(__file__).parent / "data"


def ensure_directories():
    """Create data directories if they don't exist."""
    (DATA_DIR / "ps").mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "lsof").mkdir(parents=True, exist_ok=True)


def save_snapshot(endpoint_type: str, data: dict) -> str:
    """
    Save snapshot to JSON file.

    Args:
        endpoint_type: 'ps' or 'lsof'
        data: The response data to save

    Returns:
        The timestamp string used for the filename
    """
    ensure_directories()
    timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S-%f")
    filename = f"snapshot_{timestamp}.json"
    filepath = DATA_DIR / endpoint_type / filename

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    return timestamp


def get_snapshot_list(endpoint_type: str) -> List[dict]:
    """
    Get list of all snapshots for an endpoint type.

    Returns:
        List of {timestamp, filename} dicts, sorted newest first
    """
    ensure_directories()
    dir_path = DATA_DIR / endpoint_type
    snapshots = []

    for filepath in sorted(dir_path.glob("snapshot_*.json"), reverse=True):
        filename = filepath.name
        # snapshot_2024-01-01T12-00-00-123456.json -> 2024-01-01T12-00-00-123456
        timestamp_str = filename.replace("snapshot_", "").replace(".json", "")
        snapshots.append({
            "timestamp": timestamp_str,
            "filename": filename
        })

    return snapshots


def get_snapshot(endpoint_type: str, timestamp: str) -> Optional[dict]:
    """
    Get specific snapshot by timestamp.

    Args:
        endpoint_type: 'ps' or 'lsof'
        timestamp: The timestamp string from the filename

    Returns:
        The snapshot data or None if not found
    """
    filename = f"snapshot_{timestamp}.json"
    filepath = DATA_DIR / endpoint_type / filename

    if not filepath.exists():
        return None

    with open(filepath, 'r') as f:
        return json.load(f)


def cleanup_old_snapshots(endpoint_type: str, keep_count: int = 10):
    """
    Delete oldest snapshots, keeping only the most recent ones.

    Args:
        endpoint_type: 'ps' or 'lsof'
        keep_count: Number of snapshots to keep (default 10)
    """
    ensure_directories()
    dir_path = DATA_DIR / endpoint_type
    snapshots = sorted(dir_path.glob("snapshot_*.json"), reverse=True)

    # Delete everything beyond keep_count
    for old_snapshot in snapshots[keep_count:]:
        old_snapshot.unlink()
