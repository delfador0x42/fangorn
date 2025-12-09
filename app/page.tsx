import ConnectionsPanel from "@/app/ui/lsofPanel";
import { getlsofdata } from "@/app/ui/get_lsof_data";

export default async function Home() {
  const data = await getlsofdata();

  return (
    <>
      <div className="grid-overlay" />
      <ConnectionsPanel connections={data.connections} />
    </>
  );
}
