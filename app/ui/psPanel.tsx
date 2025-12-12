"use client";

import { Draggable } from "./DraggablePanel";
import { processpanelprops } from "./get_ps_data";

export default function ProcessPanel({ processes }: processpanelprops) {
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
            <tr key={idx} className={!proc.safe ? "unsafe-process" : ""}>
              <td>{proc.pid}</td>
              <td className="text-left">{proc.cmd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Draggable>
  );
}
