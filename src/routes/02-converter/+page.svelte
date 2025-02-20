<script lang="ts">
	class Temperature {
		#c = $state(0);
		#f = $state(0);

		get c() {
			return this.#c;
		}

		set c(c) {
			this.#c = c;
			this.#f = (c * 9) / 5 + 32;
		}

		get f() {
			return this.#f;
		}

		set f(f) {
			this.#f = f;
			this.#c = ((f - 32) * 5) / 9;
		}
	}

	let temp = $state(new Temperature());
</script>

<section class="prose flex min-h-screen flex-col items-center justify-center gap-4">
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		Temperature Converter
	</h1>
	<div class="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-4">
		<div class="flex items-center justify-between gap-2 sm:gap-4">
			<input name="celsius" type="number" bind:value={temp.c} class="border border-gray-100 p-2" />
			<label for="celsius">Celsius </label>
		</div>

		<span>=</span>

		<div class="flex w-full items-center justify-between gap-2 sm:gap-4">
			<input
				name="fahrenheit"
				type="number"
				bind:value={temp.f}
				class="border border-gray-100 p-2"
			/>
			<label for="fahrenheit">Fahrenheit</label>
		</div>
	</div>
</section>
