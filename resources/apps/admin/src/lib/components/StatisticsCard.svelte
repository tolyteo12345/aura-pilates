<script>
	import FaCreditCard from 'svelte-icons/fa/FaCreditCard.svelte';

	let { value = $bindable(), href, title, icon = FaCreditCard } = $props();
</script>

<div class="stat-card">
	<div class="stat-card-content">
		<div class="stat-card-desc">
			<div class="stat-card-value">{value}</div>
			<div class="stat-card-title">{title}</div>
		</div>
		<div class="stat-card-icon">
			{#if icon}
				{@const IconComponent = icon}
				<IconComponent></IconComponent>
			{/if}
		</div>
	</div>
	<div class="stat-card-footer">
		<a {href}>Xem tất cả</a>
	</div>
</div>

<style lang="postcss">
	.stat-card {
		@apply flex w-full flex-col border bg-surface shadow-sm rounded-container-token;
	}

	.stat-card-content {
		@apply flex flex-1 items-center p-8;
	}

	.stat-card-desc {
		@apply flex-1;
	}

	.stat-card-icon {
		@apply h-12 w-12 text-primary;
	}

	.stat-card-value {
		@apply font-heading text-5xl font-semibold lining-nums;
	}

	.stat-card-title {
		@apply text-lg;
	}

	.stat-card-footer {
		@apply border-t p-4 font-semibold;
	}
</style>
