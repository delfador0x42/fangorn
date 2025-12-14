"use client";

import { useState } from "react";
import ConnectionsPanel from "./lsofPanel";
import ProcessPanel from "./psPanel";
import HistorySidebar from "./HistorySidebar";
import { getSnapshot } from "./get_history";
import { SnapshotMeta, Process, Connection, PsSnapshot, LsofSnapshot } from "./types";

interface MainViewProps {
	initialPsData: Process[];
	initialLsofData: Connection[];
	psSnapshots: SnapshotMeta[];
	lsofSnapshots: SnapshotMeta[];
}

export default function MainView({
	initialPsData,
	initialLsofData,
	psSnapshots,
	lsofSnapshots,
}: MainViewProps) {
	// Current data being displayed
	const [psData, setPsData] = useState<Process[]>(initialPsData);
	const [lsofData, setLsofData] = useState<Connection[]>(initialLsofData);

	// Selected timestamps (null = showing live/most recent data)
	const [selectedPsTimestamp, setSelectedPsTimestamp] = useState<string | null>(null);
	const [selectedLsofTimestamp, setSelectedLsofTimestamp] = useState<string | null>(null);

	// Loading state
	const [isLoading, setIsLoading] = useState(false);

	// Sidebar collapsed state
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	const handleSelectSnapshot = async (type: "ps" | "lsof", timestamp: string) => {
		setIsLoading(true);

		try {
			const data = await getSnapshot(type, timestamp);

			if (data) {
				if (type === "ps") {
					setSelectedPsTimestamp(timestamp);
					setPsData((data as PsSnapshot).process_list);
				} else {
					setSelectedLsofTimestamp(timestamp);
					setLsofData((data as LsofSnapshot).connections);
				}
			}
		} catch (err) {
			console.error("Failed to load snapshot:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="grid-overlay" />

			{/* Main content area - leave space for sidebar */}
			<div className="main-content" style={{ marginLeft: isSidebarCollapsed ? "0" : "300px", transition: "margin-left 0.3s ease" }}>
				<ConnectionsPanel connections={lsofData} />
				<ProcessPanel processes={psData} />
			</div>

			{/* History sidebar */}
			<HistorySidebar
				psSnapshots={psSnapshots}
				lsofSnapshots={lsofSnapshots}
				onSelectSnapshot={handleSelectSnapshot}
				currentPsTimestamp={selectedPsTimestamp}
				currentLsofTimestamp={selectedLsofTimestamp}
				isCollapsed={isSidebarCollapsed}
				onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
			/>

			{/* Loading overlay */}
			{isLoading && (
				<div className="loading-overlay">
					<div className="loading-text">LOADING SNAPSHOT...</div>
				</div>
			)}
		</>
	);
}
