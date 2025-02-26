<script lang="ts">
	type Circle = {
		id: string;
		cx: number;
		cy: number;
		r: number;
	};
	type Status = 'drawing' | 'editing';

	let status = $state<Status>('drawing');
	let circles = $state<Circle[]>([]);
	let selected = $state<Circle>()!;

	let snapshots: Circle[][] = [];
	let history = $state(-1);

	function drawCircle(e: MouseEvent) {
		if (status === 'editing') {
			snapshot();
			status = 'drawing';
			return;
		}
		const svgEl = e.target as SVGSVGElement;
		const { left, top } = svgEl.getBoundingClientRect();

		const circle = {
			id: crypto.randomUUID(),
			cx: +(e.clientX - left).toFixed(2),
			cy: +(e.clientY - top).toFixed(2),
			r: 40
		};

		circles.push(circle);
		selected = circle;

		snapshot();
	}

	function undo() {
		circles = snapshots[--history];
	}

	function redo() {
		circles = snapshots[++history];
	}

	function snapshot() {
		history++;
		snapshots.push($state.snapshot(circles));
	}
</script>

<section class="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center">
	<h1 class="text-center text-4xl font-extrabold lg:text-5xl">Circle Drawer</h1>

	<div class="flex flex-col gap-2">
		<div class="flex gap-2">
			<button
				onclick={undo}
				class="cursor-pointer bg-black px-4 py-2 text-white"
				disabled={history === -1}>Undo</button
			>
			<button
				onclick={redo}
				class="cursor-pointer bg-black px-4 py-2 text-white"
				disabled={history === snapshots.length - 1}>Redo</button
			>
		</div>

		{#if status === 'editing'}
			<div
				class="absolute top-1/2 left-1/2 w-[400px] translate-x-[-50%] translate-y-[-50%] border border-gray-200 bg-white/10 p-4 text-center backdrop-blur-xs"
			>
				<span>Adjust diameter of circle at {selected?.cx}, {selected?.cy}</span>
				<input type="range" bind:value={selected.r} />
			</div>
		{/if}

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<svg
			onclick={drawCircle}
			viewBox="0 0 600 400"
			class="h-[400px] w-[600px] border-2 border-gray-200"
		>
			{#each circles as circle}
				<circle
					{...circle}
					fill={selected?.id === circle.id ? 'rgba(0, 0, 255, 0.1)' : 'transparent'}
					stroke="#666666"
					stroke-width="1"
					onclick={(e) => {
						e.stopPropagation();
						selected = circle;
					}}
					oncontextmenu={(e) => {
						if (status === 'editing') {
							snapshot();
						}
						e.preventDefault();
						status = 'editing';
						selected = circle;
					}}
				>
				</circle>
			{/each}
		</svg>
	</div>
</section>

<style>
</style>
