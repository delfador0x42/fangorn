import { getManPageContent, getManPageNames } from "@/app/ui/get_manpages";
import Link from "next/link";

interface ProcessPageProps {
	params: Promise<{ name: string }>;
}

export default async function ProcessPage({ params }: ProcessPageProps) {
	const { name } = await params;
	const decodedName = decodeURIComponent(name);
	const manPages = await getManPageNames();
	const hasManPage = manPages.has(decodedName);
	const manContent = hasManPage ? await getManPageContent(decodedName) : null;

	return (
		<>
			<div className="grid-overlay" />
			<div className="process-detail-page">
				<Link href="/" className="back-link">
					&laquo; BACK TO DASHBOARD
				</Link>

				<h1 className="process-title">{decodedName}</h1>

				{hasManPage && manContent ? (
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
		</>
	);
}
