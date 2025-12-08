export async function getUsers() {
	const res = await fetch("http://127.0.0.1:8000/test_endpoint", { cache: "no-store", next: {revalidate: 1 }}); 
	return res;
}


const result = await getUsers();
console.log(result)


