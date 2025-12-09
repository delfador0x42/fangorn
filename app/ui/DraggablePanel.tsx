// Basically everything under /app is server components so this "use client" tells nextjs that we are going to use client components instead
// https://nextjs.org/docs/app/api-reference/directives/use-client
"use client";  // Tells nextjs that we are going to use client components



// useRef
// https://react.dev/reference/react/useRef
// Stores a value that you can reference/update without triggering a rerender

// useEffect
// https://react.dev/reference/react/useEffect
// https://react.dev/learn/synchronizing-with-effects

import React, { useRef, useEffect, useState } from 'react';

export const Draggable = ({ children }: { children: React.ReactNode }) => {
	const boxRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [pos, setPos] = useState({ x: 100, y: 100 }); 
	const [size, setSize] = useState({ width: 800, height: 40});

	const offset = useRef({ x: 0, y: 0 });
	const resizeStart = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });

	const onMouseDown = (e: React.MouseEvent) => {
		console.log("boxRef.current is :: ", boxRef.current);
		if (!boxRef.current) return;

		setIsDragging(true);

		const rect = boxRef.current.getBoundingClientRect();
		offset.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};

		e.preventDefault();
	};

	const onResizeMouseDown = (e: React.MouseEvent) => {
		setIsResizing(true);

		resizeStart.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			width: size.width,
			height: size.height,
		};

		e.stopPropagation();
		e.preventDefault();
	};

	useEffect(() => {
		if (!isDragging) return;

		const onMouseMove = (e: MouseEvent) => {
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

	useEffect(() => {
		if (!isResizing) return;

		const onMouseMove = (e: MouseEvent) => {
			const deltaX = e.clientX - resizeStart.current.mouseX;
			const deltaY = e.clientY - resizeStart.current.mouseY;

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