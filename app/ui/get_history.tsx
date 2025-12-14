// History API fetch functions

import { SnapshotMeta, PsSnapshot, LsofSnapshot } from "./types";

const API_BASE = "http://127.0.0.1:8000";

/**
 * Fetch list of snapshots for an endpoint type
 */
export async function getSnapshotList(type: "ps" | "lsof"): Promise<SnapshotMeta[]> {
	try {
		console.log(`[history] fetching ${type} snapshot list...`);
		const res = await fetch(`${API_BASE}/history/${type}`, {
			cache: "no-store",
		});

		if (!res.ok) {
			console.warn(`[history] server returned ${res.status}`);
			return [];
		}

		const data = await res.json();
		return data.snapshots || [];
	} catch (err) {
		console.warn(`[history] fetch failed:`, err);
		return [];
	}
}

/**
 * Fetch specific historical snapshot by timestamp
 */
export async function getSnapshot(
	type: "ps" | "lsof",
	timestamp: string
): Promise<PsSnapshot | LsofSnapshot | null> {
	try {
		console.log(`[history] fetching ${type} snapshot: ${timestamp}`);
		const res = await fetch(`${API_BASE}/history/${type}/${timestamp}`, {
			cache: "no-store",
		});

		if (!res.ok) {
			console.warn(`[history] server returned ${res.status}`);
			return null;
		}

		return await res.json();
	} catch (err) {
		console.warn(`[history] fetch failed:`, err);
		return null;
	}
}

/**
 * Fetch both snapshot lists in parallel
 */
export async function getAllSnapshotLists(): Promise<{
	psSnapshots: SnapshotMeta[];
	lsofSnapshots: SnapshotMeta[];
}> {
	const [psSnapshots, lsofSnapshots] = await Promise.all([
		getSnapshotList("ps"),
		getSnapshotList("lsof"),
	]);

	return { psSnapshots, lsofSnapshots };
}
