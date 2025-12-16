"use client";

import { useEffect, useState } from "react";
import { getManPageContent } from "@/app/lib/api";

interface ProcessDetailModalProps {
	processName: string | null;
	onClose: () => void;
}

export default function ProcessDetailModal({ processName, onClose }: ProcessDetailModalProps) {
	const [manContent, setManContent] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (processName) {
			setLoading(true);
			getManPageContent(processName)
				.then(setManContent)
				.finally(() => setLoading(false));
		}
	}, [processName]);

	if (!processName) return null;

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close" onClick={onClose}>
					&times;
				</button>

				<h1 className="process-title">{processName}</h1>

				{loading ? (
					<div className="loading-text">LOADING...</div>
				) : manContent ? (
					<div className="man-page-container">
						<div className="man-page-header">
							<span className="man-badge">MAN PAGE</span>
							<span className="man-section">Section 8 - System Administration</span>
						</div>
						<pre className="man-page-content">{manContent}</pre>
					</div>
				) : (
					<div className="no-man-page">
						<div className="warning-icon">!</div>
						<p>No man page found for this process.</p>
						<p className="warning-subtext">
							This process is not documented in the system man pages.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
