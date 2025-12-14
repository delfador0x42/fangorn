"use client";

interface ExpandButtonProps {
	isExpanded: boolean;
	onClick: () => void;
}

export default function ExpandButton({ isExpanded, onClick }: ExpandButtonProps) {
	return (
		<button
			className={`expand-btn ${isExpanded ? "expanded" : ""}`}
			onClick={onClick}
			aria-expanded={isExpanded}
			aria-label={isExpanded ? "Hide history" : "Show history"}
		>
			<span className="expand-icon">+</span>
			<span className="expand-label">
				{isExpanded ? "HIDE HISTORY" : "VIEW HISTORY"}
			</span>
		</button>
	);
}
