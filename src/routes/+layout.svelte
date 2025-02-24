<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	let { data, children } = $props();
	let { navItems } = data;
</script>

{#snippet anchor(link: string, title: string | undefined)}
	<a href={link}>{title}</a>
{/snippet}

<nav
	class="fixed top-0 right-0 left-0 z-50 h-16 items-center justify-center bg-white p-2 shadow-sm"
>
	<div class="hidden h-full items-center justify-center gap-4 md:flex">
		<ul class="flex h-full items-center justify-center gap-4">
			{#each navItems as item}
				<li>
					<a href={item.link} class="text-gray-600 hover:text-blue-600">{item.title}</a>
				</li>
			{/each}
		</ul>
	</div>
	{#if browser}
		<div class="md:hidden">
			<select
				onchange={(e) => {
					const target = e.target as HTMLSelectElement;
					if (target) {
						window.location.href = target.value;
					}
				}}
				class="h-full bg-white p-2"
			>
				<option value="" disabled>Select a page</option>
				{#each navItems as item}
					<option value={item.link} selected={item.link === window.location.pathname}
						>{item.title}</option
					>
				{/each}
			</select>
		</div>
	{/if}
</nav>

<main class="container mx-auto px-4 py-8 pt-20">
	{@render children()}
</main>
