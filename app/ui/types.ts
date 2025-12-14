// Shared TypeScript interfaces for the application

// Snapshot metadata returned by history list endpoints
export interface SnapshotMeta {
	timestamp: string;
	filename: string;
}

export interface HistoryListResponse {
	snapshots: SnapshotMeta[];
}

// Re-export existing types for convenience
export interface Process {
	pid: string;
	cmd: string;
	safe: boolean;
}

export interface Connection {
	command: string;
	pid: string;
	user: string;
	fd: string;
	type: string;
	device: string;
	size_offset: string;
	node: string;
	name: string;
}

export interface PsSnapshot {
	timestamp: string;
	process_list: Process[];
}

export interface LsofSnapshot {
	timestamp: string;
	connections: Connection[];
}
