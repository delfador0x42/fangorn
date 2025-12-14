"use client";

import { useState } from "react";
import ExpandButton from "./ExpandButton";
import SnapshotDropdown from "./SnapshotDropdown";
import { SnapshotMeta } from "./types";

interface HistorySidebarProps {
	psSnapshots: SnapshotMeta[];
	lsofSnapshots: SnapshotMeta[];
	onSelectSnapshot: (type: "ps" | "lsof", timestamp: string) => void;
	currentPsTimestamp: string | null;
	currentLsofTimestamp: string | null;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
}

/**
 * Format the current viewing timestamp for display
 */
function formatCurrentTimestamp(timestamp: string | null): string {
	if (!timestamp) return "LIVE";

	// timestamp format: 2024-01-01T12-00-00-123456
	const parts = timestamp.split("T");
	if (parts.length < 2) return timestamp;

	const timePart = parts[1];
	const timeSegments = timePart.split("-");
	if (timeSegments.length < 3) return timestamp;

	return `${parts[0]} ${timeSegments[0]}:${timeSegments[1]}:${timeSegments[2]}`;
}

export default function HistorySidebar({
	psSnapshots,
	lsofSnapshots,
	onSelectSnapshot,
	currentPsTimestamp,
	currentLsofTimestamp,
	isCollapsed,
	onToggleCollapse,
}: HistorySidebarProps) {
	const [activeTab, setActiveTab] = useState<"ps" | "lsof">("ps");
	const [isExpanded, setIsExpanded] = useState(false);

	const currentSnapshots = activeTab === "ps" ? psSnapshots : lsofSnapshots;
	const currentTimestamp =
		activeTab === "ps" ? currentPsTimestamp : currentLsofTimestamp;

	// Historical snapshots (skip first one which is current/most recent)
	const historical = currentSnapshots.slice(1);

	if (isCollapsed) {
		return (
			<button
				className="sidebar-star-btn"
				onClick={onToggleCollapse}
				title="Expand history sidebar"
			>
				<pre className="star-icon">{`

             .                      .
             .                      ;
             :                  - --+- -
             !                      !
             |                      .
             |_          
          ,  | \`.
 ------ --+-<#>-+- ---  --  -
          \`._|_,'
             T
             |
             !
             :            
             .        
             `}</pre>
			</button>
		);
	}

	return (
		<aside className="history-sidebar">
			{/* Collapse button */}
			<button
				className="sidebar-collapse-btn"
				onClick={onToggleCollapse}
				title="Collapse sidebar"
			>
				<span className="collapse-icon">«</span>
			</button>

			{/* Tab headers */}
			<div className="sidebar-tabs">
				<button
					className={`tab ${activeTab === "ps" ? "active" : ""}`}
					onClick={() => {
						setActiveTab("ps");
						setIsExpanded(false);
					}}
				>
					PROCESSES
				</button>
				<button
					className={`tab ${activeTab === "lsof" ? "active" : ""}`}
					onClick={() => {
						setActiveTab("lsof");
						setIsExpanded(false);
					}}
				>
					CONNECTIONS
				</button>
			</div>

			{/* Current/selected snapshot */}
			<div className="current-snapshot">
				<span className="label">VIEWING:</span>
				<span className="timestamp">
					{formatCurrentTimestamp(currentTimestamp)}
				</span>
			</div>

			{/* Expand button with dropdown */}
			<div className="history-section">
				<ExpandButton
					isExpanded={isExpanded}
					onClick={() => setIsExpanded(!isExpanded)}
				/>

				{isExpanded && (
					<SnapshotDropdown
						snapshots={historical}
						selectedTimestamp={currentTimestamp}
						onSelect={(timestamp) => {
							onSelectSnapshot(activeTab, timestamp);
							setIsExpanded(false);
						}}
					/>
				)}
			</div>

			{/* Info text */}
			<div className="sidebar-info">
				<span className="info-count">
					{currentSnapshots.length} snapshots stored
				</span>
			</div>
		</aside>
	);
}
