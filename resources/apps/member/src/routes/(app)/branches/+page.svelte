<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { getBranches } from '$lib/api/branches.js';
	import { getMe } from '$lib/api/me.js';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let branches = $state([]);
	let memberBranchIds = $state(new Set());
	let loading = $state(true);

	onMount(async () => {
		try {
			const [branchData, meData] = await Promise.all([getBranches(), getMe()]);

			branches = Array.isArray(branchData) ? branchData : (branchData.data ?? []);

			const me = meData.data ?? meData;
			// Collect branch IDs from member's subscriptions or branches array
			const ids = new Set();
			if (Array.isArray(me.branches)) {
				me.branches.forEach((b) => ids.add(b.id ?? b));
			}
			if (Array.isArray(me.subscriptions)) {
				me.subscriptions.forEach((s) => {
					if (s.branch_id) ids.add(s.branch_id);
					if (s.branch?.id) ids.add(s.branch.id);
				});
			}
			memberBranchIds = ids;
		} catch (err) {
			toastStore.trigger({
				message: err.message ?? 'Không thể tải danh sách chi nhánh.',
				background: 'variant-filled-error'
			});
		} finally {
			loading = false;
		}
	});

	const isMemberBranch = (branch) => memberBranchIds.has(branch.id);
</script>

<svelte:head>
	<title>Chi nhánh - Aura Studio</title>
</svelte:head>

<div class="px-4 pb-4 pt-6">
	<h1 class="mb-6 text-3xl font-semibold text-primary">Chi nhánh studio</h1>

	{#if loading}
		<SkeletonLoader type="card" count={4} class="mb-3" />
	{:else if branches.length === 0}
		<div class="card rounded-2xl border border-secondary/60 bg-surface p-8 text-center">
			<p class="font-semibold text-primary">Không tìm thấy chi nhánh nào</p>
			<p class="mt-1 text-sm text-muted">Vui lòng quay lại sau.</p>
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each branches as branch}
				{@const mine = isMemberBranch(branch)}
				<div
					class="card rounded-2xl p-4 {mine
						? 'border border-primary bg-surface'
						: 'border border-secondary/60 bg-surface'}"
				>
					<div class="flex items-start gap-3">
						<!-- Icon -->
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full {mine
								? 'bg-secondary'
								: 'bg-secondary/40'}"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="h-5 w-5 {mine ? 'text-primary' : 'text-muted'}"
							>
								<path
									fill-rule="evenodd"
									d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h-2v2h2V5zm0 4h-2v2h2V9z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>

						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h3 class="font-semibold text-primary">{branch.name}</h3>
								{#if mine}
									<span class="badge variant-filled-primary text-xs">Chi nhánh của bạn</span>
								{/if}
							</div>

							{#if branch.address}
								<p class="mt-1 text-sm text-muted">{branch.address}</p>
							{/if}

							{#if branch.city || branch.state}
								<p class="text-sm text-muted">
									{[branch.city, branch.state].filter(Boolean).join(', ')}
								</p>
							{/if}

							{#if branch.phone}
								<a
									href="tel:{branch.phone}"
									class="mt-1 block text-sm text-primary-hover underline-offset-4 hover:text-primary hover:underline"
								>
									{branch.phone}
								</a>
							{/if}

							{#if branch.email}
								<a
									href="mailto:{branch.email}"
									class="block text-sm text-primary-hover underline-offset-4 hover:text-primary hover:underline"
								>
									{branch.email}
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
