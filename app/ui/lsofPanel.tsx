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
    // RENDER PROP: children is now a function that receives { onResizeMouseDown, isResizing }
    <Draggable>
      {({ onResizeMouseDown, isResizing }) => (
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Command</th>
              <th>PID</th>
              <th>User</th>
              <th>FD</th>
              <th>Type</th>
              <th>Node</th>
              {/* Name header with resize handle */}
              <th style={{ position: 'relative' }}>
                Name
                {/* Resize handle in bottom-right of Name column header */}
                <div
                  onMouseDown={onResizeMouseDown}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 20,
                    height: 20,
                    cursor: 'se-resize',
                    background: `linear-gradient(
                      135deg,
                      transparent 50%,
                      var(--neon-cyan, #00f0ff) 50%,
                      var(--neon-cyan, #00f0ff) 60%,
                      transparent 60%,
                      transparent 70%,
                      var(--neon-cyan, #00f0ff) 70%,
                      var(--neon-cyan, #00f0ff) 80%,
                      transparent 80%
                    )`,
                    opacity: isResizing ? 1 : 0.7,
                  }}
                />
              </th>
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
      )}
    </Draggable>
  );
}
