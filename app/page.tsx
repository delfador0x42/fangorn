"use client";

import { useEffect, useState } from "react";
import MainView from "@/app/ui/MainView";
import { getAllData, Process, Connection, SnapshotMeta } from "@/app/lib/api";

interface AppData {
  processes: Process[];
  connections: Connection[];
  psSnapshots: SnapshotMeta[];
  lsofSnapshots: SnapshotMeta[];
  manPageNames: string[];
}

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h1>CONNECTION ERROR</h1>
          <p>Failed to connect to server at localhost:5001</p>
          <p className="error-detail">{error}</p>
          <button onClick={() => window.location.reload()}>RETRY</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading-screen">
        <div className="loading-text">INITIALIZING...</div>
      </div>
    );
  }

  return (
    <MainView
      initialPsData={data.processes}
      initialLsofData={data.connections}
      psSnapshots={data.psSnapshots}
      lsofSnapshots={data.lsofSnapshots}
      manPageNames={data.manPageNames}
    />
  );
}
