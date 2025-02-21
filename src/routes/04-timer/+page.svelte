<script lang="ts">
	/**
1.	Gauge (G): Displays the elapsed time visually.
2.	Label: Shows the elapsed time as a number.
3.	Slider (S): Adjusts the timer’s total duration (d) while it’s running. Changes should take effect immediately, not just when released.
4.	Reset Button (R): Resets the elapsed time (e) to zero.

Behavior:
•	The timer runs until the elapsed time (e) reaches the set duration (d).
•	If d is increased after the timer stops, making d > e, the timer restarts and runs until e = d again.
•	The gauge (G) updates in real-time as the slider (S) is moved.
*/

	let d = $state(5);
	let e = $state(0);
	let interval: number;

	function start() {
		interval = setInterval(() => {
			e += 0.1;
			if (e > d) {
				e = d;
				clearInterval(interval);
			}
		}, 100);
	}

	function reset() {
		e = 0;
		start();
	}

	$effect(() => {
		if (!d) return;
		start();
		return () => {
			clearInterval(interval);
		};
	});
</script>

<section class="prose flex min-h-screen flex-col items-center justify-center gap-4">
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">Timer</h1>

	<label for="file">Elapsed Time: </label>
	<progress id="file" value={e} max={d} class="w-1/2"> {e} </progress>

	<p>{e.toFixed(1)}</p>

	<label for="file">Duration: </label>
	<input type="range" min="1" max="10" bind:value={d} class="w-1/2" id="duration" />

	<button onclick={reset} class="w-1/2 cursor-pointer bg-black px-4 py-2 text-white">Reset</button>
</section>
