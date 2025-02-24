<script lang="ts">
	let { data } = $props();
	let { navItems } = data;
	let navItemsWithoutHome = navItems.filter((item) => item.title !== 'Home');
</script>

<main class="container mx-auto px-4 pt-20 pb-8">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each navItemsWithoutHome as item}
			<a href={item.link} class="group block">
				<div
					class="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
				>
					<div class="p-4">
						<h2
							class="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-600"
						>
							{item.title}
						</h2>
					</div>
				</div>
			</a>
		{/each}
	</div>
</main>
