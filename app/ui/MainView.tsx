"use client";

import { useState } from "react";
import ConnectionsPanel from "./lsofPanel";
import ProcessPanel from "./psPanel";
import HistorySidebar from "./HistorySidebar";
import ProcessDetailModal from "./ProcessDetailModal";
import { getPsSnapshot, getLsofSnapshot, Process, Connection, SnapshotMeta } from "@/app/lib/api";

interface MainViewProps {
	initialPsData: Process[];
	initialLsofData: Connection[];
	psSnapshots: SnapshotMeta[];
	lsofSnapshots: SnapshotMeta[];
	manPageNames: string[];
}

export default function MainView({
	initialPsData,
	initialLsofData,
	psSnapshots,
	lsofSnapshots,
	manPageNames,
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

	// Selected process for detail modal
	const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

	const handleSelectSnapshot = async (type: "ps" | "lsof", timestamp: string) => {
		setIsLoading(true);

		try {
			if (type === "ps") {
				const data = await getPsSnapshot(timestamp);
				setSelectedPsTimestamp(timestamp);
				setPsData(data.process_list);
			} else {
				const data = await getLsofSnapshot(timestamp);
				setSelectedLsofTimestamp(timestamp);
				setLsofData(data.connections);
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
				<ProcessPanel
					processes={psData}
					manPageNames={manPageNames}
					onSelectProcess={setSelectedProcess}
				/>
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

			{/* Process detail modal */}
			<ProcessDetailModal
				processName={selectedProcess}
				onClose={() => setSelectedProcess(null)}
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
