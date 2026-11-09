<script>
	// @ts-nocheck

	import Logo from '$lib/components/Logo.svelte';
	import Wrapper from '$lib/components/wrapper.svelte';

	const { children } = $props();
</script>

<Wrapper>
	<div class="login">
		<div class="login-card">
			<div class="mx-auto mb-8 flex justify-center">
				<Logo />
			</div>
			{@render children()}
		</div>
	</div>
</Wrapper>

<style lang="postcss">
	.login {
		@apply fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center overflow-y-auto bg-background;
	}

	.login-card {
		@apply mx-4 border border-secondary/60 bg-surface p-8 shadow-none rounded-container-token lg:my-8 lg:shadow-sm;
		width: 500px;
		max-width: 100%;
	}
</style>
