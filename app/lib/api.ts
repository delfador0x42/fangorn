const API_BASE = "http://localhost:5001";

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

export interface SnapshotMeta {
	timestamp: string;
	filename: string;
}

export interface PsResponse {
	timestamp: string;
	process_list: Process[];
}

export interface LsofResponse {
	timestamp: string;
	connections: Connection[];
}

export interface HistoryResponse {
	snapshots: SnapshotMeta[];
}

export interface ManPageListResponse {
	names: string[];
}

export interface ManPageContentResponse {
	name: string;
	content: string;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${API_BASE}${endpoint}`);
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

export async function getProcessList(): Promise<PsResponse> {
	return fetchApi<PsResponse>("/ps_endpoint");
}

export async function getConnections(): Promise<LsofResponse> {
	return fetchApi<LsofResponse>("/lsof_endpoint");
}

export async function getPsHistory(): Promise<HistoryResponse> {
	return fetchApi<HistoryResponse>("/history/ps");
}

export async function getLsofHistory(): Promise<HistoryResponse> {
	return fetchApi<HistoryResponse>("/history/lsof");
}

export async function getPsSnapshot(timestamp: string): Promise<PsResponse> {
	return fetchApi<PsResponse>(`/history/ps/${timestamp}`);
}

export async function getLsofSnapshot(timestamp: string): Promise<LsofResponse> {
	return fetchApi<LsofResponse>(`/history/lsof/${timestamp}`);
}

export async function getManPageList(): Promise<string[]> {
	const response = await fetchApi<ManPageListResponse>("/manpages");
	return response.names;
}

export async function getManPageContent(name: string): Promise<string | null> {
	try {
		const response = await fetchApi<ManPageContentResponse>(`/manpages/${encodeURIComponent(name)}`);
		return response.content;
	} catch {
		return null;
	}
}

export async function getAllData() {
	const [psData, lsofData, psHistory, lsofHistory, manPages] = await Promise.all([
		getProcessList(),
		getConnections(),
		getPsHistory(),
		getLsofHistory(),
		getManPageList(),
	]);

	return {
		processes: psData.process_list,
		connections: lsofData.connections,
		psSnapshots: psHistory.snapshots,
		lsofSnapshots: lsofHistory.snapshots,
		manPageNames: manPages,
	};
}
