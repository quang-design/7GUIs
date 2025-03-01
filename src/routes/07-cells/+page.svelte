<script lang="ts">
	const rows = 10;
	const cols = 10;
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	const data = $state([
		[{ value: 'Item' }, { value: 'Price' }, { value: 'Amount' }, { value: 'Total' }],
		[{ value: '🍌' }, { value: '1' }, { value: '4' }, { value: '=MULTIPLY(B2,C2)' }],
		[{ value: '🍎' }, { value: '2' }, { value: '2' }, { value: '=MULTIPLY(B3,C3)' }],
		[{ value: '' }, { value: '' }, { value: 'Total' }, { value: '=SUM(D2,D3)' }]
	]);

	let selectedCell = $state();
	let editingCell = $state();

	function parseValue(value: string): string | number {
		if (value.startsWith('=')) {
			const { operation, cells } = parseFormula(value);

			const values = cells.map(({ row, col }) => {
				const value = data[row][col]?.value;
				if (value.startsWith('=')) {
					return +parseValue(value);
				}
				return +value;
			});

			return values.reduce(
				(total, value) => {
					if (operation === 'SUM') return total + value;
					if (operation === 'MULTIPLY') return total * value;
					return total;
				},
				operation === 'MULTIPLY' ? 1 : 0
			);
		}
		return value;
	}

	function parseFormula(value: string) {
		// =MULTIPLY(B2,C2)
		const [a, b] = value.split('(');
		const operation = a.split('=')[1];
		const cells = b.replace(')', '').split(',');
		return { operation, cells: cells.map(cellNameToIndex) };
	}

	function cellNameToIndex(value: string) {
		// A1 -> 00 -> data[0][0]
		const [col, ...row] = value.split('');
		return { row: +row.join('') - 1, col: letters.indexOf(col) };
	}

	function update(e: Event) {
		const { value, parentElement } = e.target as HTMLInputElement;
		const { row, col } = cellNameToIndex(parentElement!.dataset.cell!);

		if (data[row]) {
			if (data[row][col]) {
				data[row][col].value = value;
			} else {
				data[row][col] = { value };
			}
		} else {
			data[row] = [];
			data[row][col] = { value };
		}
	}
</script>

<section class="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center">
	<h1 class="text-center text-4xl font-extrabold lg:text-5xl">Cells</h1>

	<table class="max-w-3xl">
		<thead>
			<tr>
				<th></th>
				{#each Array(cols) as _, i}
					<th>{letters[i]}</th>
				{/each}
			</tr>
		</thead>

		<tbody>
			{#each Array(rows) as _, i}
				<tr>
					<th>{i + 1}</th>
					{#each Array(cols) as _, j}
						{@const cell = `${letters[j]}${i + 1}`}
						{@const value = data[i]?.[j]?.value}
						{@const parsedValue = value ? parseValue(value) : ''}
						{@const selected = selectedCell === cell}
						{@const editing = editingCell === cell}
						<td
							data-cell={cell}
							class="h-10 w-40 text-left font-semibold"
							class:selected
							onclick={() => {
								if (selected) return;
								selectedCell = cell;
								editingCell = null;
							}}
							ondblclick={() => (editingCell = cell)}
						>
							{#if editing}
								<!-- svelte-ignore a11y_autofocus -->
								<input
									type="text"
									{value}
									oninput={update}
									autofocus
									class="h-full bg-transparent p-0 outline-none"
								/>
							{:else}
								<span>{parsedValue}</span>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style>
	.selected {
		outline: 1px solid yellowgreen;
		border-radius: 4px;
	}
</style>
