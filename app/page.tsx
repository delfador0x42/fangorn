import ConnectionsPanel from "@/app/ui/lsofPanel";

interface Connection {
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

async function getHostData(): Promise<{ connections: Connection[] }> {
  const res = await fetch("http://127.0.0.1:8000/test_endpoint", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const data = await getHostData();

  return (
    <>
      <div className="grid-overlay" />
      <ConnectionsPanel connections={data.connections} />
    </>
  );
}
