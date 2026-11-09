<script>
	import { AppBar, getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	const drawerOpen = () => drawerStore.open({});
</script>

<AppBar background="bg-surface" border="border-b border-secondary">
	<svelte:fragment slot="lead">
		<div class="flex items-center">
			<button class="btn btn-sm mr-4 lg:hidden" aria-label="Mở menu" onclick={drawerOpen}>
				<span>
					<svg viewBox="0 0 100 80" class="h-4 w-4 fill-current text-primary">
						<rect width="100" height="20" />
						<rect y="30" width="100" height="20" />
						<rect y="60" width="100" height="20" />
					</svg>
				</span>
			</button>
			<strong class="font-heading text-2xl font-semibold text-primary">Aura</strong>
			<span class="ml-3 hidden text-xs uppercase tracking-widest text-muted sm:inline"
				>Studio Pilates &amp; Wellness</span
			>
		</div>
	</svelte:fragment>
</AppBar>
