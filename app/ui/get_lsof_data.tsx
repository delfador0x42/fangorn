// connection data types and fetch function for lsof endpoint

export interface connection {
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


// i realize it says interface ... but i'm pretty sure this is a type
// and it's a type that has one property connections which is an arry of "connection" objects
export interface connectionspanelprops {
	connections: connection[];
}
	
export async function getlsofdata(): Promise<{ connections: connection[] }> {
try {
	console.log("[lsof] fetching from server...");
	const res = await fetch("http://127.0.0.1:8000/lsof_endpoint", {
		cache: "no-store",
		// Remove revalidate - it conflicts with no-store and causes caching
		// next: { revalidate: 10 },
	});
	console.log("[lsof] got response:", res.status, res.ok);


	// not 200
	// a change
	// test
	if (!res.ok) {
		const text = await res.text();
		console.warn(`[lsof] server returned ${res.status}. body:`, text);
		return { connections: [] };
	}


	// log raw response status first (very helpful!)
	// console.log("status:", res.status, res.statustext);
	// console.log("headers:", object.fromentries(res.headers.entries()));

	// "await" the json parsing
	const data = await res.json();

	return data; // this is now { connections: connection[] }
} catch (err) {
	console.warn("await fetch() totally failed")
	return { connections: [] };
}
}