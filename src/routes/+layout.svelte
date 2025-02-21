<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<nav class="absolute top-4 left-4">
	<ul class="flex flex-col gap-1 sm:flex-row">
		<li><a href="/">Home</a></li>
		<li><a href="/01-counter">01-Counter</a></li>
		<li><a href="/02-converter">02-Converter</a></li>
		<li><a href="/03-flight">03-Flight Booker</a></li>
		<li><a href="/04-timer">04-Timer</a></li>
	</ul>
</nav>

{@render children()}
