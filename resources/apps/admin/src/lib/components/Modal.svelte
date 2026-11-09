<script>
	let { maxWidth, minHeight, children } = $props();
</script>

<div class="modal" style:maxWidth style:minHeight>
	{@render children()}
</div>

<style lang="postcss">
	.modal {
		@apply mx-4 flex w-full flex-col bg-surface shadow-lg rounded-container-token lg:mx-0;
	}
</style>
