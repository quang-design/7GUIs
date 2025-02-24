<script lang="ts">
	// ✅ Circle Drawer - Development Checklist

	// --- Canvas Interaction ---
	// [x] Left-click creates an unfilled circle at the clicked position.
	// [x] Circles have a fixed diameter.
	// [x] Hovering over a circle (if within radius) highlights it in gray (selection).
	// [x] Right-click on a selected circle opens a context menu.

	// --- Context Menu & Dialog ---
	// [x] Context menu includes an "Adjust diameter..." option.
	// [ ] Selecting this option opens a slider dialog.
	// [ ] Changes are applied in real-time as the slider moves.
	// [ ] Closing the dialog marks the last diameter change as significant for undo/redo.

	// --- Undo/Redo System ---
	// [ ] Implement undo to reverse the last significant action (circle creation or diameter change).
	// [ ] Implement redo to reapply the last undone action unless new changes were made.

	// --- Development Considerations ---
	// [ ] Ensure efficient state tracking for undo/redo management.
	// [ ] Optimize custom drawing for smooth rendering and re-rendering.
	// [ ] Maintain dialog control across multiple UI interactions.
	// [ ] Ensure intuitive mouse event handling for a seamless user experience.

	let canvas: HTMLCanvasElement;
	let canvasWidth = $state(0);
	let canvasHeight = $state(0);

	let mouseX = $state(0);
	let mouseY = $state(0);

	const circles = $state<{ x: number; y: number }[]>([]);
	$inspect(circles);

	let showContextMenu = $state(false);
	let contextMenuX = $state(0);
	let contextMenuY = $state(0);
	let selectedCircleIndex = $state<number | null>(null);

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

		selectedCircleIndex = null;
		circles.forEach((circle, index) => {
			const dx = circle.x - mouseX;
			const dy = circle.y - mouseY;
			if (Math.sqrt(dx * dx + dy * dy) <= 50) {
				selectedCircleIndex = index;
			}
		});
		redrawCanvas();
	}

	function drawCircle() {
		circles.push({ x: mouseX, y: mouseY });
		redrawCanvas();
	}

	function redrawCanvas() {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		circles.forEach((circle, index) => {
			const dx = circle.x - mouseX;
			const dy = circle.y - mouseY;
			const isCircleHovered = Math.sqrt(dx * dx + dy * dy) <= 50;

			ctx.beginPath();
			ctx.arc(circle.x, circle.y, 50, 0, 2 * Math.PI);
			ctx.strokeStyle = isCircleHovered ? 'oklch(0.546 0.245 262.881)' : 'oklch(0.145 0 0)';
			ctx.fillStyle = isCircleHovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent';
			ctx.fill();
			ctx.stroke();
		});
	}

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		if (selectedCircleIndex !== null) {
			showContextMenu = true;
			contextMenuX = event.clientX;
			contextMenuY = event.clientY;
		}
	}

	function closeContextMenu() {
		showContextMenu = false;
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

	<div>
		<button>Undo</button>
		<button>Redo</button>
	</div>

	<div class="relative h-full min-h-96 w-full">
		<canvas
			bind:this={canvas}
			width={canvasWidth}
			height={canvasHeight}
			class="absolute inset-0 h-full w-full border border-gray-300"
			onclick={drawCircle}
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
						// TODO: Implement adjust diameter
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

	<p>Mouse Position: <br />({mouseX}, {mouseY})</p>
	<p>Canvas Size: <br />({canvasWidth / 2}, {canvasHeight / 2})</p>
</section>

<style>
</style>
