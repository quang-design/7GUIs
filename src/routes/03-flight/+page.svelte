<script lang="ts">
	type Options = 'one-way' | 'return';

	function getDate() {
		const date = new Date();
		const d = date.toISOString().split('T')[0];
		return d;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		alert(`You are booking a ${selected} flight from ${startDate}.`);
	}

	let selected = $state<Options>('one-way');
	let startDate = $state(getDate());
	let returnDate = $state(getDate());
</script>

<section class="prose flex min-h-screen flex-col items-center justify-center gap-4">
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		Flight Booker
	</h1>

	<form class="flex flex-col gap-2" onsubmit={handleSubmit}>
		<select class="border border-gray-100 p-2" bind:value={selected}>
			<option value="one-way">one-way flight</option>
			<option value="return">return flight</option>
		</select>

		<input type="date" class="border border-gray-100 p-2" bind:value={startDate} min={getDate()} />

		<input
			type="date"
			class="border border-gray-100 p-2"
			bind:value={returnDate}
			min={getDate()}
			disabled={selected === 'one-way'}
		/>

		<button
			type="submit"
			class="cursor-pointer border border-gray-100 bg-black p-2 text-white"
			disabled={!startDate || (selected === 'return' && returnDate < startDate)}
		>
			Submit
		</button>
	</form>
</section>

<style>
	input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
