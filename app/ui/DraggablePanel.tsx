"use client"; // telling nextjs to use client components


// useRef seems to be a way to store information without triggering a rerender
// useEffect ??
// useState update a variable/anything and trigger rerender
import React, { useRef, useEffect, useState } from 'react';

// Alright so 'children' is a prop
// it seems that "props" are arguments to other components
// So essentially we take
// So essentially <component> prop/function argument <component/>

// Back to simple: children is just React.ReactNode
// The panel wrapper and resize handle stay here in Draggable
export const Draggable = ({ children }: { children: React.ReactNode }) => {
	const boxRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false); // similar to isDragging but for resize
	const [pos, setPos] = useState({ x: 100, y: 100 }); // starting position
	const [size, setSize] = useState({ width: 800, height: 40});

	// These will store the offset from click → box corner
	const offset = useRef({ x: 0, y: 0 });
	// Store the initial size and mouse position when resize starts
	const resizeStart = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });

	const onMouseDown = (e: React.MouseEvent) => {
		if (!boxRef.current) return;

		// So this is a state change this is a useState state change so this triggers a rerender
		setIsDragging(true);

		// How far inside the box did they click?
		const rect = boxRef.current.getBoundingClientRect();
		offset.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};

		// Prevent text selection while dragging
		e.preventDefault();
	};

	// Similar to onMouseDown but for the resize handle
	// We capture where the mouse started and what size the box was
	const onResizeMouseDown = (e: React.MouseEvent) => {
		setIsResizing(true);

		// Store initial mouse position and current size
		// We'll calculate the delta (change) from this starting point
		resizeStart.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			width: size.width,
			height: size.height,
		};

		// stopPropagation prevents the drag handler from also firing
		// (since resize handle is inside the draggable div)
		e.stopPropagation();
		e.preventDefault();
	};

	useEffect(() => {
		if (!isDragging) return;

		const onMouseMove = (e: MouseEvent) => {
			// setPos will trigger a rerender
			setPos({
				x: e.pageX - offset.current.x,
				y: e.pageY - offset.current.y,
			});
		};

		const onMouseUp = () => {
			setIsDragging(false);
		};

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);

		return () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};
	}, [isDragging]);

	// useEffect for resize - same pattern as drag!
	// When isResizing becomes true, we attach listeners
	// When it becomes false (mouseup), we clean them up
	useEffect(() => {
		if (!isResizing) return;

		const onMouseMove = (e: MouseEvent) => {
			// Calculate how far the mouse moved from where we started
			const deltaX = e.clientX - resizeStart.current.mouseX;
			const deltaY = e.clientY - resizeStart.current.mouseY;

			// New size = original size + how far we dragged
			// Math.max ensures minimum size (can't resize smaller than 200x150)
			setSize({
				width: Math.max(200, resizeStart.current.width + deltaX),
				height: Math.max(150, resizeStart.current.height + deltaY),
			});
		};

		const onMouseUp = () => {
			setIsResizing(false);
		};

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);

		return () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};
	}, [isResizing]);

	return (
		<div
			ref={boxRef}
			onMouseDown={onMouseDown}
			style={{
				position: 'absolute',
				left: pos.x,
				top: pos.y,
				width: size.width,
				height: size.height,
				// Panel styling - the outline/border
				background: 'rgba(5, 15, 25, 0.95)',
				border: '1px solid var(--neon-cyan, #00f0ff)',
				boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff40, 0 0 40px rgba(0, 0, 0, 0.5)',
				display: 'flex',
				flexDirection: 'column' as const,
				cursor: isDragging ? 'grabbing' : 'grab',
				userSelect: 'none',
			}}
		>
			{/* Panel content area - children go here */}
			<div style={{
				flex: 1,
				overflow: 'auto',
				padding: 15,
				cursor: 'default', // reset cursor for content area
			}}>
				{children}
			</div>

			{/* Resize handle - bottom right of the panel */}
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
		</div>
	);
};