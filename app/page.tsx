import MainView from "@/app/ui/MainView";
import { getlsofdata } from "@/app/ui/get_lsof_data";
import { getpsdata } from "@/app/ui/get_ps_data";
import { getAllSnapshotLists } from "@/app/ui/get_history";
import { getManPageList } from "@/app/ui/get_manpages";

export default async function Home() {
  // Fetch all data sources in parallel
  const [lsofData, psData, snapshotLists, manPageNames] = await Promise.all([
    getlsofdata(),
    getpsdata(),
    getAllSnapshotLists(),
    getManPageList(),
  ]);

  return (
    <MainView
      initialPsData={psData.process_list}
      initialLsofData={lsofData.connections}
      psSnapshots={snapshotLists.psSnapshots}
      lsofSnapshots={snapshotLists.lsofSnapshots}
      manPageNames={manPageNames}
    />
  );
}
