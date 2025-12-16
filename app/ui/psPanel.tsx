"use client";

import { useRouter } from "next/navigation";
import { Draggable } from "./DraggablePanel";
import { Process } from "./types";

interface ProcessPanelProps {
  processes: Process[];
  manPageNames: string[];
}

/**
 * Extract basename from a command path
 */
function getBasename(cmd: string): string {
  const execPath = cmd.split(/\s+/)[0];
  const parts = execPath.split("/");
  return parts[parts.length - 1];
}

export default function ProcessPanel({ processes, manPageNames }: ProcessPanelProps) {
  const router = useRouter();
  const manPageSet = new Set(manPageNames);

  const handleRowClick = (cmd: string) => {
    const basename = getBasename(cmd);
    router.push(`/process/${encodeURIComponent(basename)}`);
  };

  const getRowClassName = (proc: Process): string => {
    const classes: string[] = ["process-row"];
    if (!proc.safe) {
      classes.push("unsafe-process");
    }
    const basename = getBasename(proc.cmd);
    if (!manPageSet.has(basename)) {
      classes.push("unknown-process");
    }
    return classes.join(" ");
  };

  return (
    <Draggable>
      <table className="cyber-table">
        <thead>
          <tr>
            <th>PID</th>
            <th className="text-left">Command</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((proc, idx) => (
            <tr
              key={idx}
              className={getRowClassName(proc)}
              onClick={() => handleRowClick(proc.cmd)}
            >
              <td>{proc.pid}</td>
              <td className="text-left">{proc.cmd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Draggable>
  );
}
