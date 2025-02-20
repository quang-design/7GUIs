<script lang="ts">
	let count = $state(0);
</script>

<section class="prose flex min-h-screen flex-col items-center justify-center gap-4">
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		Counter
	</h1>
	<div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
		<input
			type="number"
			bind:value={count}
			class="cursor-not-allowed border border-gray-100 p-2"
			disabled
		/>
		<button onclick={() => count++} class="cursor-pointer bg-black px-4 py-2 text-white">
			Count
		</button>
	</div>
</section>
