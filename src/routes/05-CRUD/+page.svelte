<script lang="ts">
	/**
	 * Checklist:
	 * - [x] Data:
	 *     - [x] filter: Surname filter input
	 *     - [x] input: { name, surname } for new entries
	 *     - [x] people: List of names (name + surname)
	 *     - [x] selected: Currently selected entry (null or Person)
	 *
	 * - [x] Behaviors:
	 *     - [x] Filter: Dynamically show names with matching surname prefix.
	 *     - [x] Create: Add new entry (input.name + input.surname) to people.
	 *     - [x] Update: Replace selected entry with input.name + input.surname.
	 *     - [x] Delete: Remove selected entry from people.
	 *     - [x] Enable/Disable: Update/Delete buttons enabled only if an entry is selected.
	 *     - [x] Layout: List expands to fill remaining space.
	 */

	type Person = {
		name: string;
		surname: string;
	};

	let filter = $state('');
	let input = $state({ name: '', surname: '' });
	let selected = $state<Person>();

	let people = $state<Person[]>([
		{ name: 'Emil', surname: 'Hans' },
		{ name: 'Mustermann', surname: 'Max' },
		{ name: 'Tisch', surname: 'Roman' }
	]);

	let error = $state('');

	function handleCreate() {
		people.push({ ...input });
		clear();
	}

	function handleUpdate() {
		const index = people.indexOf(selected!);
		people[index] = { name: input.name, surname: input.surname };
		clear();
	}

	function handleDelete() {
		people = people.filter((p) => p.name !== selected?.name || p.surname !== selected?.surname);
		clear();
	}

	function clear() {
		filter = '';
		selected = undefined;
		input = { name: '', surname: '' };
		error = '';
	}
</script>

<section class="prose mx-auto flex min-h-screen max-w-sm flex-col items-start justify-center gap-4">
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">CRUD</h1>

	<div class="flex items-center gap-2">
		<label for="filter">Filter:</label>
		<input type="text" bind:value={filter} class="border border-gray-100" id="filter" />
	</div>

	<div class="flex items-start gap-8">
		<div
			class="flex h-42 w-1/2 flex-col items-start gap-2 overflow-auto border border-gray-100 p-2"
		>
			{#each people as person}
				<label
					class="cursor-pointer hover:bg-gray-100
					{selected === person ? 'bg-blue-100' : ''}
					{person.name.toLowerCase().includes(filter.toLowerCase()) ? '' : 'hidden'}
					"
				>
					<input
						type="radio"
						bind:group={selected}
						value={person}
						onclick={() => (selected === person ? (selected = undefined) : (selected = person))}
					/>
					<span>{person.name}, {person.surname}</span>
				</label>
			{/each}
		</div>

		<div class="flex w-1/2 flex-col items-start gap-2">
			{#if selected}
				<form onsubmit={handleUpdate}>
					<label for="name">Name:</label>
					<input type="text" bind:value={selected.name} class="border border-gray-100" id="name" />

					<label for="surname">Surname:</label>
					<input
						type="text"
						bind:value={selected.surname}
						class="border border-gray-100"
						id="surname"
					/>
				</form>
			{:else}
				<form>
					<label for="name">Name:</label>
					<input
						type="text"
						bind:value={input.name}
						class="border border-gray-100"
						id="name"
						required
					/>

					<label for="surname">Surname:</label>
					<input
						type="text"
						bind:value={input.surname}
						class="border border-gray-100"
						id="surname"
						required
					/>
				</form>
			{/if}
			{#if error.length > 0}
				<p class="text-sm text-red-500">{error}</p>
			{/if}
		</div>
	</div>

	<div class="flex gap-2">
		<button
			class="cursor-pointer bg-black px-4 py-2 text-white"
			onclick={handleCreate}
			disabled={!!selected}
		>
			Create
		</button>
		<button
			class="cursor-pointer bg-black px-4 py-2 text-white"
			disabled={!selected}
			onclick={handleUpdate}
		>
			Update
		</button>
		<button
			class="cursor-pointer bg-black px-4 py-2 text-white"
			disabled={!selected}
			onclick={handleDelete}
		>
			Delete
		</button>
	</div>
</section>

<style>
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
