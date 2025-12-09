import subprocess

process_connections = []

class lsof_line :
	def __init__(
		self,
		command: str,
		pid: str,
		user: str,
		fd: str,
		type: str,
		device: str,
		size_offset: str,
		node: str,
		name) -> None :


		self.command = command
		self.pid = pid
		self.user = user
		self.fd = fd
		self.type = type
		self.device = device
		self.size_offset = size_offset
		self.node = node
		self.name = name


def parse_lsof(output: str) :
	for line in output.splitlines() :
		fields = line.split()
		if fields[0] == "COMMAND" : 
			continue
			print(fields[0])	
		# Fixed fields (indices 0–7)
		command  = fields[0]
		print(command)
		pid	  = fields[1]
		user	 = fields[2]
		fd	   = fields[3]
		type_	= fields[4]
		device   = fields[5]
		size_offset  = fields[6]
		node	 = fields[7]

		# Everything from index 8 onward is the NAME (may contain spaces!)
		name	 = " ".join(fields[8:])

		# Create and store the object
		obj = lsof_line(
		command=command,
		pid=pid,
		user=user,
		fd=fd,
		type=type_,
		device=device,
		size_offset=size_offset,
		node=node,
		name=name
		)
		print()
		process_connections.append(obj)




presult = subprocess.run("lsof -Pni", shell=True, capture_output=True)


match presult.returncode : 
	case 0 :
		output = presult.stdout.decode('utf-8')
		parse_lsof(output)
		print(process_connections[0].command)
	case _ :
		print("failure")



import fastapi


app = fastapi.FastAPI()

@app.get("/")
def send_stuff():
	return {"id": "Hello From the Server"}

@app.get("/lsof_endpoint")
def get_connections():
	return {
		"connections": [
			{
				"command": conn.command,
				"pid": conn.pid,
				"user": conn.user,
				"fd": conn.fd,
				"type": conn.type,
				"device": conn.device,
				"size_offset": conn.size_offset,
				"node": conn.node,
				"name": conn.name
			}
			for conn in process_connections
		]
	}