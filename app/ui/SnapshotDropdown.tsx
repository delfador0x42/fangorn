"use client";

import { SnapshotMeta } from "./types";

interface SnapshotDropdownProps {
	snapshots: SnapshotMeta[];
	selectedTimestamp: string | null;
	onSelect: (timestamp: string) => void;
}

/**
 * Format timestamp for display (more human readable)
 */
function formatTimestamp(timestamp: string): string {
	// timestamp format: 2024-01-01T12-00-00-123456
	// Convert to: 12:00:00
	const parts = timestamp.split("T");
	if (parts.length < 2) return timestamp;

	const timePart = parts[1];
	const timeSegments = timePart.split("-");
	if (timeSegments.length < 3) return timestamp;

	return `${timeSegments[0]}:${timeSegments[1]}:${timeSegments[2]}`;
}

/**
 * Format date for display
 */
function formatDate(timestamp: string): string {
	// timestamp format: 2024-01-01T12-00-00-123456
	const parts = timestamp.split("T");
	if (parts.length < 1) return "";
	return parts[0];
}

export default function SnapshotDropdown({
	snapshots,
	selectedTimestamp,
	onSelect,
}: SnapshotDropdownProps) {
	if (snapshots.length === 0) {
		return (
			<div className="snapshot-dropdown">
				<div className="dropdown-empty">No history available</div>
			</div>
		);
	}

	return (
		<div className="snapshot-dropdown">
			{snapshots.map((snapshot, idx) => (
				<div
					key={snapshot.timestamp}
					className={`dropdown-item ${
						selectedTimestamp === snapshot.timestamp ? "selected" : ""
					}`}
					style={{ animationDelay: `${idx * 40}ms` }}
					onClick={() => onSelect(snapshot.timestamp)}
				>
					<span className="dropdown-time">{formatTimestamp(snapshot.timestamp)}</span>
					<span className="dropdown-date">{formatDate(snapshot.timestamp)}</span>
				</div>
			))}
		</div>
	);
}
