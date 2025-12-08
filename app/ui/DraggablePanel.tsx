"use client";

import { useState, useRef, useCallback, ReactNode } from "react";

interface DraggablePanelProps {
  children: ReactNode;
  title?: string;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

export default function DraggablePanel({
  children,
  title,
  defaultPosition = { x: 40, y: 100 },
  defaultSize = { width: 800, height: 400 },
}: DraggablePanelProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("panel-header")) {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  }, [position]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    dragOffset.current = {
      x: e.clientX,
      y: e.clientY,
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    } else if (isResizing) {
      const deltaX = e.clientX - dragOffset.current.x;
      const deltaY = e.clientY - dragOffset.current.y;
      setSize((prev) => ({
        width: Math.max(300, prev.width + deltaX),
        height: Math.max(200, prev.height + deltaY),
      }));
      dragOffset.current = { x: e.clientX, y: e.clientY };
    }
  }, [isDragging, isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  return (
    <div
      ref={panelRef}
      className="draggable-panel"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="panel-header" onMouseDown={handleMouseDown}>
        <span className="panel-indicator" />
        {title && <span className="panel-title">{title}</span>}
        <div className="panel-controls">
          <span className="panel-btn" />
          <span className="panel-btn" />
          <span className="panel-btn close" />
        </div>
      </div>
      <div className="panel-content">
        {children}
      </div>
      <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
    </div>
  );
}
