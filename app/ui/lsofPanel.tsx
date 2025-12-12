"use client";

import { Draggable } from "./DraggablePanel";

// So this ConnectionsPanelProps is a type
import { connectionspanelprops } from "./get_lsof_data";

// Basically think of this as a function getting called that takes argument "connections" that is of type "ConnectionsPanelProps"
export default function ConnectionsPanel({ connections }: connectionspanelprops) {
  return (
    // Simple: just pass the table as children
    // Draggable handles the panel outline and resize handle
    <Draggable>
      <table className="cyber-table">
        <thead>
          <tr>
            <th className="text-left">Command</th>
            <th>PID</th>
            <th>User</th>
            <th>FD</th>
            <th>Type</th>
            <th>Node</th>
            <th className="text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn, idx) => (
            <tr key={idx}>
              <td className="text-left">{conn.command}</td>
              <td>{conn.pid}</td>
              <td>{conn.user}</td>
              <td>{conn.fd}</td>
              <td>{conn.type}</td>
              <td>{conn.node}</td>
              <td className="text-left">{conn.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Draggable>
  );
}
