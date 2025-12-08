"use client";

import {Draggable} from "./DraggablePanel";

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

interface ConnectionsPanelProps {
  connections: Connection[];
}

export default function ConnectionsPanel({ connections }: ConnectionsPanelProps) {
  return (
    // Simple: just pass the table as children
    // Draggable handles the panel outline and resize handle
    <Draggable>
      <table className="cyber-table">
        <thead>
          <tr>
            <th>Command</th>
            <th>PID</th>
            <th>User</th>
            <th>FD</th>
            <th>Type</th>
            <th>Node</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn, idx) => (
            <tr key={idx}>
              <td>{conn.command}</td>
              <td>{conn.pid}</td>
              <td>{conn.user}</td>
              <td>{conn.fd}</td>
              <td>{conn.type}</td>
              <td>{conn.node}</td>
              <td>{conn.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Draggable>
  );
}
