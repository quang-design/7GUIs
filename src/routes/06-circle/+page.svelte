<script lang="ts">
	// ✅ Circle Drawer - Development Checklist

	// --- Canvas Interaction ---
	// [x] Left-click creates an unfilled circle at the clicked position.
	// [x] Circles have a fixed diameter.
	// [x] Hovering over a circle (if within radius) highlights it in gray (selection).
	// [x] Right-click on a selected circle opens a context menu.

	// --- Context Menu & Dialog ---
	// [x] Context menu includes an "Adjust diameter..." option.
	// [x] Selecting this option opens a slider dialog.
	// [x] Changes are applied in real-time as the slider moves.
	// [x] Closing the dialog marks the last diameter change as significant for undo/redo.

	// --- Undo/Redo System ---
	// [x] Implement undo to reverse the last significant action (circle creation or diameter change).
	// [x] Implement redo to reapply the last undone action unless new changes were made.

	// --- Development Considerations ---
	// [x] Ensure efficient state tracking for undo/redo management.
	// [x] Optimize custom drawing for smooth rendering and re-rendering.
	// [x] Maintain dialog control across multiple UI interactions.
	// [x] Ensure intuitive mouse event handling for a seamless user experience.

	import SliderDialog from './SliderDialog.svelte';

	let canvas: HTMLCanvasElement;
	let canvasWidth = $state(0);
	let canvasHeight = $state(0);

	let mouseX = $state(0);
	let mouseY = $state(0);

	interface Circle {
		x: number;
		y: number;
		diameter: number;
	}

	const circles = $state<Circle[]>([]);
	const undoStack = $state<Circle[][]>([]);
	const redoStack = $state<Circle[][]>([]);

	// Track if we're in the middle of a diameter adjustment
	let isAdjustingDiameter = $state(false);
	let originalDiameter = $state<number | null>(null);

	// Reactive effect to ensure canvas redraws when circles change
	$effect(() => {
		// Trigger redraw whenever circles array changes
		if (circles.length >= 0) {
			redrawCanvas();
		}
	});

	// Helper function to save state
	function saveState() {
		undoStack.push(JSON.parse(JSON.stringify(circles)));
		redoStack.length = 0; // Clear redo stack when new action is performed
	}

	let showContextMenu = $state(false);
	let contextMenuX = $state(0);
	let contextMenuY = $state(0);
	let selectedCircleIndex = $state<number | null>(null);
	let hoveredCircleIndex = $state<number | null>(null);

	let showSliderDialog = $state(false);
	let selectedCircleDiameter = $state(100);

	function getCanvasSize() {
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			const scale = window.devicePixelRatio || 1;
			canvasWidth = rect.width * scale;
			canvasHeight = rect.height * scale;
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			canvas.getContext('2d')?.scale(scale, scale);
			redrawCanvas();
		}
	}

	function handleMouseMove(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;

		hoveredCircleIndex = null;
		circles.forEach((circle, index) => {
			const dx = circle.x - mouseX;
			const dy = circle.y - mouseY;
			if (Math.sqrt(dx * dx + dy * dy) <= circle.diameter / 2) {
				hoveredCircleIndex = index;
			}
		});
		redrawCanvas();
	}

	function handleCanvasClick(event: MouseEvent) {
		if (event.button === 0) {
			// Left click
			if (hoveredCircleIndex !== null) {
				// Select the circle if hovering over one
				selectedCircleIndex = hoveredCircleIndex;
			} else {
				// Create a new circle if not hovering over any
				saveState(); // Save state before adding new circle
				circles.push({ x: mouseX, y: mouseY, diameter: 100 });
				selectedCircleIndex = null;
			}
		}
	}

	function redrawCanvas() {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		circles.forEach((circle, index) => {
			const isCircleHovered = index === hoveredCircleIndex;
			const isCircleSelected = index === selectedCircleIndex;

			ctx.beginPath();
			ctx.arc(circle.x, circle.y, circle.diameter / 2, 0, 2 * Math.PI);
			ctx.strokeStyle = isCircleSelected
				? 'oklch(0.546 0.245 262.881)'
				: isCircleHovered
					? 'oklch(0.346 0.145 262.881)'
					: 'oklch(0.145 0 0)';
			ctx.fillStyle = isCircleSelected
				? 'rgba(0, 0, 0, 0.1)'
				: isCircleHovered
					? 'rgba(0, 0, 0, 0.05)'
					: 'transparent';
			ctx.fill();
			ctx.stroke();
		});
	}

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		if (hoveredCircleIndex !== null) {
			selectedCircleIndex = hoveredCircleIndex;
			showContextMenu = true;
			contextMenuX = event.clientX;
			contextMenuY = event.clientY;
			selectedCircleDiameter = circles[selectedCircleIndex].diameter;
			originalDiameter = selectedCircleDiameter; // Store original diameter
		}
	}

	function closeContextMenu() {
		showContextMenu = false;
	}

	function handleUndo() {
		if (undoStack.length > 0) {
			// Save current state to redo stack
			redoStack.push(JSON.parse(JSON.stringify(circles)));
			// Pop and apply last state from undo stack
			const lastState = undoStack.pop()!;
			circles.length = 0;
			circles.push(...lastState);
			// Reset selection and dialog states
			selectedCircleIndex = null;
			showSliderDialog = false;
			showContextMenu = false;
		}
	}

	function handleRedo() {
		if (redoStack.length > 0) {
			// Save current state to undo stack
			undoStack.push(JSON.parse(JSON.stringify(circles)));
			// Pop and apply last state from redo stack
			const nextState = redoStack.pop()!;
			circles.length = 0;
			circles.push(...nextState);
			// Reset selection and dialog states
			selectedCircleIndex = null;
			showSliderDialog = false;
			showContextMenu = false;
		}
	}

	$effect(() => {
		if (canvas) {
			getCanvasSize();

			const resizeObserver = new ResizeObserver(getCanvasSize);
			resizeObserver.observe(canvas);

			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('contextmenu', handleContextMenu);

			// Add window click listener to close context menu
			const handleWindowClick = (event: MouseEvent) => {
				const contextMenu = document.querySelector('.context-menu');
				if (contextMenu && !contextMenu.contains(event.target as Node)) {
					closeContextMenu();
				}
			};
			window.addEventListener('click', handleWindowClick);

			return () => {
				resizeObserver.disconnect();
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('contextmenu', handleContextMenu);
				window.removeEventListener('click', handleWindowClick);
			};
		}
	});
</script>

<section class="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center">
	<h1 class="text-center text-4xl font-extrabold lg:text-5xl">Circle Drawer</h1>

	<div class="flex gap-2">
		<button onclick={handleUndo} class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
			>Undo</button
		>
		<button onclick={handleRedo} class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
			>Redo</button
		>
	</div>

	<div class="relative h-full min-h-96 w-full">
		<canvas
			bind:this={canvas}
			width={canvasWidth}
			height={canvasHeight}
			class="absolute inset-0 h-full w-full border border-gray-300"
			onclick={handleCanvasClick}
			onresize={getCanvasSize}
		></canvas>

		{#if showContextMenu}
			<div
				class="context-menu fixed z-50 rounded border border-gray-200 bg-white shadow-lg"
				style="left: {contextMenuX}px; top: {contextMenuY}px;"
			>
				<button
					class="w-full px-4 py-2 text-left hover:bg-gray-100"
					onclick={() => {
						showSliderDialog = true;
						closeContextMenu();
					}}
				>
					Adjust diameter...
				</button>
			</div>

			<!-- Backdrop for context menu -->
			<div class="fixed inset-0 z-40"></div>
		{/if}
	</div>

	<SliderDialog
		isOpen={showSliderDialog}
		diameter={selectedCircleDiameter}
		onDiameterChange={(value) => {
			if (selectedCircleIndex !== null) {
				if (!isAdjustingDiameter) {
					// First diameter change
					isAdjustingDiameter = true;
					saveState(); // Save state before first change
				}
				selectedCircleDiameter = value;
				circles[selectedCircleIndex].diameter = value;
			}
		}}
		onClose={() => {
			// Only save state if there was an actual change
			if (
				isAdjustingDiameter &&
				selectedCircleIndex !== null &&
				originalDiameter !== circles[selectedCircleIndex].diameter
			) {
				saveState();
			}
			// Reset adjustment tracking
			isAdjustingDiameter = false;
			originalDiameter = null;
			showSliderDialog = false;
		}}
	/>

	<p>Mouse Position: <br />({mouseX}, {mouseY})</p>
	<p>Canvas Size: <br />({canvasWidth / 2}, {canvasHeight / 2})</p>
</section>

<style>
</style>
