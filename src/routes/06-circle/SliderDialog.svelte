<script lang="ts">
	const {
		isOpen = false,
		diameter,
		onDiameterChange,
		onClose
	} = $props<{
		isOpen?: boolean;
		diameter: number;
		onDiameterChange: (value: number) => void;
		onClose: () => void;
	}>();

	let dialogElement = $state<HTMLDialogElement>();

	$effect(() => {
		if (isOpen && dialogElement) {
			dialogElement.showModal();
		} else if (dialogElement) {
			dialogElement.close();
		}
	});

	function handleInput(event: Event) {
		const value = (event.target as HTMLInputElement).valueAsNumber;
		onDiameterChange(value);
	}

	function handleClose() {
		// Close dialog and trigger parent's close handler with the final diameter value
		onClose();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialogElement}
	onclick={handleClose}
	class="absolute inset-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg border border-white bg-white/75 p-8 shadow-lg backdrop-blur-xs"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={(e) => e.stopPropagation()} class="flex flex-col gap-4">
		<h2 class="text-xl font-bold">Adjust Circle Diameter</h2>
		<div class="flex items-center gap-4">
			<input type="range" min="10" max="150" value={diameter} oninput={handleInput} class="w-64" />
			<span class="min-w-[3ch]">{diameter}px</span>
		</div>
		<button onclick={handleClose} class="self-end">Close</button>
	</div>
</dialog>
