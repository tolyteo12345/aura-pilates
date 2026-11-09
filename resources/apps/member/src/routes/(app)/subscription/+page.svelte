<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { getSubscriptions } from '$lib/api/me.js';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import moment from 'moment';

	const toastStore = getToastStore();

	let subscriptions = $state([]);
	let loading = $state(true);

	const getStatusClass = (status) => {
		switch (status?.toLowerCase()) {
			case 'active':
				return 'badge variant-filled-success';
			case 'expired':
				return 'badge variant-filled-error';
			case 'pending':
				return 'badge variant-filled-warning';
			default:
				return 'badge variant-soft-primary';
		}
	};

	// Display labels only; status values from the API stay in English
	const statusLabels = {
		active: 'Đang hoạt động',
		expired: 'Hết hạn',
		pending: 'Chờ xử lý',
		inactive: 'Ngừng hoạt động',
		suspended: 'Tạm ngưng'
	};

	onMount(async () => {
		try {
			const data = await getSubscriptions();
			subscriptions = Array.isArray(data) ? data : (data.data ?? []);
		} catch (err) {
			toastStore.trigger({
				message: err.message ?? 'Không thể tải danh sách gói đăng ký.',
				background: 'variant-filled-error'
			});
		} finally {
			loading = false;
		}
	});

	const active = $derived(
		subscriptions.find((s) => s.status?.toLowerCase() === 'active') ?? null
	);
	const history = $derived(
		subscriptions.filter((s) => s.status?.toLowerCase() !== 'active')
	);
</script>

<svelte:head>
	<title>Gói đăng ký - Aura Studio</title>
</svelte:head>

<div class="px-4 pb-4 pt-6">
	<h1 class="mb-6 text-3xl font-semibold text-primary">Gói đăng ký</h1>

	<!-- Current active subscription (highlighted) -->
	<section class="mb-6">
		<h2 class="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-muted">
			Gói đang hoạt động
		</h2>

		{#if loading}
			<SkeletonLoader type="card" />
		{:else if active}
			<div class="card rounded-2xl bg-primary p-5 shadow-sm">
				<div class="mb-4 flex items-start justify-between">
					<div>
						<p class="text-xs text-secondary">Gói tập</p>
						<p class="text-xl font-bold text-white">
							{active.package?.name ?? active.package_name ?? 'Gói hội viên'}
						</p>
					</div>
					<span class={getStatusClass(active.status)}
						>{statusLabels[active.status?.toLowerCase()] ?? active.status}</span
					>
				</div>

				<div class="grid grid-cols-2 gap-4">
					{#if active.starts_at}
						<div>
							<p class="text-xs text-secondary">Ngày bắt đầu</p>
							<p class="text-sm font-medium text-white">
								{moment(active.starts_at).format('L')}
							</p>
						</div>
					{/if}
					{#if active.expires_at}
						<div>
							<p class="text-xs text-secondary">Ngày hết hạn</p>
							<p class="text-sm font-medium text-white">
								{moment(active.expires_at).format('L')}
							</p>
						</div>
					{/if}
					{#if active.price !== undefined}
						<div>
							<p class="text-xs text-secondary">Giá</p>
							<p class="text-sm font-medium text-white">
								{active.price}
							</p>
						</div>
					{/if}
					{#if active.branch}
						<div>
							<p class="text-xs text-secondary">Chi nhánh</p>
							<p class="text-sm font-medium text-white">
								{active.branch?.name ?? active.branch}
							</p>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="card rounded-2xl border border-secondary/60 bg-surface p-6 text-center">
				<p class="font-semibold text-primary">Chưa có gói đăng ký đang hoạt động</p>
				<p class="mt-1 text-sm text-muted">Vui lòng liên hệ studio để đăng ký gói hội viên.</p>
			</div>
		{/if}
	</section>

	<!-- History -->
	<section>
		<h2 class="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-muted">
			Lịch sử
		</h2>

		{#if loading}
			<SkeletonLoader type="card" count={3} />
		{:else if history.length === 0}
			<div class="card rounded-2xl border border-secondary/60 bg-surface p-6 text-center">
				<p class="text-muted">Chưa có lịch sử gói đăng ký.</p>
			</div>
		{:else}
			<div class="flex flex-col gap-3">
				{#each history as sub}
					<div class="card rounded-2xl border border-secondary/60 bg-surface p-4">
						<div class="flex items-start justify-between">
							<div>
								<p class="font-semibold text-primary">
									{sub.package?.name ?? sub.package_name ?? 'Gói hội viên'}
								</p>
								<p class="mt-1 text-xs text-muted">
									{#if sub.starts_at}
										{moment(sub.starts_at).format('L')}
									{/if}
									{#if sub.starts_at && sub.expires_at}
										&nbsp;→&nbsp;
									{/if}
									{#if sub.expires_at}
										{moment(sub.expires_at).format('L')}
									{/if}
								</p>
							</div>
							<span class={getStatusClass(sub.status)}
							>{statusLabels[sub.status?.toLowerCase()] ?? sub.status}</span
						>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
