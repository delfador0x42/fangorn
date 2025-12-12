// process list data types and fetch function for ps endpoint

export interface process {
	pid: string;
	cmd: string;
	safe: boolean;
}

export interface processpanelprops {
	processes: process[];
}

export async function getpsdata(): Promise<{ process_list: process[] }> {
	try {
		console.log("[ps] fetching from server...");
		const res = await fetch("http://127.0.0.1:8000/ps_endpoint", {
			cache: "no-store",
		});
		//console.log("[ps] got response:", res.status, res.ok);

		if (!res.ok) {
			const text = await res.text();
			console.warn(`[ps] server returned ${res.status}. body:`, text);
			return { process_list: [] };
		}

		const data = await res.json();
		console.log("[ps] got response:", data.process_list);
		return data;


		// // If we get here, it's safe to parse JSON
		// let data;
		// try {
		// 	data = await res.json();
		// } catch (parseErr) {
		// 	console.error("[ps] failed to parse JSON:", parseErr);
		// 	console.log("[ps] raw body was:", await res.clone().text()); // still available if not consumed yet
		// 	return { process_list: [] };
		// }




	} catch (err) {
		console.warn("[ps] fetch failed:", err);
		return { process_list: [] };
	}
}
