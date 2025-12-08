"use client"; // telling nextjs to use client components


// useRef seems to be a way to store information without triggering a rerender
// useEffect ??
// useState update a variable/anything and trigger rerender
import React, { useRef, useEffect, useState } from 'react';

// Alright so 'children' is a prop
// it seems that "props" are arguments to other components
// So essentially we take
// So essentially <component> prop/function argument <component/>

// RENDER PROP PATTERN:
// Instead of children being just JSX (React.ReactNode),
// children is a FUNCTION that we call with the resize props.
// This lets the consumer (lsofPanel) access onResizeMouseDown and isResizing!
interface RenderProps {
	onResizeMouseDown: (e: React.MouseEvent) => void;
	isResizing: boolean;
}

export	const Draggable = ({ children }: { children: (props: RenderProps) => React.ReactNode }) => {
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

				// So notice that pos is a variable with the setPos and from the useState Hook so a rerender will occur with the new "pos" and that will change the pos.x and pos.y
				left: pos.x,
				top: pos.y,
				// Note that isDragging is also a useState hook and will cause a rerender, though I'm not sure what "cursor" css thing is doing in the first place
				// From MDM
				// The cursor CSS property sets the mouse cursor, if any, to show when the mouse pointer is over an element
				// Great! So this will determine when the cursor turns into a grab! Nice!
				cursor: isDragging ? 'grabbing' : 'grab',
				// So there's a similar "user-select" from real css from MDM so I'm assuming this will do the same
				// Basically it sets if the text can be selected ... And we'll have to change this ... right now the text is never selectable and we want it sometimes selectable
				userSelect: 'none',
				// optional visual goodies
				//padding: '20px',
				//color: 'white',
				//borderRadius: '8px',
				//touchAction: 'none', // important for mobile
				width: size.width,
				height: size.height,

			}}
		>
			{/* Call children as a function, passing the resize props */}
			{/* Now lsofPanel can use onResizeMouseDown and isResizing! */}
			{children({ onResizeMouseDown, isResizing })}
		</div>
	);
};