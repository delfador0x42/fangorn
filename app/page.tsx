import ConnectionsPanel from "@/app/ui/lsofPanel";
import ProcessPanel from "@/app/ui/psPanel";
import { getlsofdata } from "@/app/ui/get_lsof_data";
import { getpsdata } from "@/app/ui/get_ps_data";

export default async function Home() {
  // Fetch both data sources in parallel
  const [lsofData, psData] = await Promise.all([
    getlsofdata(),
    getpsdata(),
  ]);

  return (
    <>
      <div className="grid-overlay" />
      <ConnectionsPanel connections={lsofData.connections} />
      <ProcessPanel processes={psData.process_list} />
    </>
  );
}
