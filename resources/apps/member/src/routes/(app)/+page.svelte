<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.js';
	import { getMe } from '$lib/api/me.js';
	import { getSubscriptions } from '$lib/api/me.js';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import moment from 'moment';

	const toastStore = getToastStore();

	let user = $state(null);
	let subscriptions = $state([]);
	let activeSubscription = $state(null);
	let loading = $state(true);

	const getInitials = (name) => {
		if (!name) return '?';
		return name
			.split(' ')
			.map((n) => n[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	};

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
			const [meData, subData] = await Promise.all([getMe(), getSubscriptions()]);
			user = meData.data ?? meData;
			// Support paginated { data: [...] } or plain array
			const subs = Array.isArray(subData) ? subData : (subData.data ?? []);
			subscriptions = subs;
			activeSubscription = subs.find((s) => s.status?.toLowerCase() === 'active') ?? null;

			// Update stored user
			authStore.setUser(user);
		} catch (err) {
			toastStore.trigger({
				message: err.message ?? 'Không thể tải dữ liệu trang chủ.',
				background: 'variant-filled-error'
			});
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Trang chủ - Aura Studio</title>
</svelte:head>

<div class="px-4 pb-4 pt-6">
	<!-- Header greeting -->
	{#if loading}
		<SkeletonLoader type="text" class="mb-6" />
	{:else}
		<div class="mb-6">
			<p class="text-sm text-muted">Chào mừng trở lại,</p>
			<h1 class="text-3xl font-semibold text-primary">{user?.name ?? 'Hội viên'}</h1>
			{#if user?.account_number}
				<p class="text-xs text-muted">Tài khoản: {user.account_number}</p>
			{/if}
		</div>
	{/if}

	<!-- Active subscription card -->
	<section class="mb-6">
		<h2 class="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-muted">
			Gói đăng ký hiện tại
		</h2>

		{#if loading}
			<SkeletonLoader type="card" />
		{:else if activeSubscription}
			<div class="card rounded-2xl bg-primary p-5 shadow-sm">
				<div class="mb-3 flex items-start justify-between">
					<div>
						<p class="text-xs text-secondary">Gói tập</p>
						<p class="text-lg font-bold text-white">
							{activeSubscription.package?.name ?? activeSubscription.package_name ?? 'Gói hội viên'}
						</p>
					</div>
					<span class={getStatusClass(activeSubscription.status)}>
						{statusLabels[activeSubscription.status?.toLowerCase()] ?? activeSubscription.status}
					</span>
				</div>
				<div class="flex gap-6">
					{#if activeSubscription.starts_at}
						<div>
							<p class="text-xs text-secondary">Ngày bắt đầu</p>
							<p class="text-sm font-medium text-white">
								{moment(activeSubscription.starts_at).format('L')}
							</p>
						</div>
					{/if}
					{#if activeSubscription.expires_at}
						<div>
							<p class="text-xs text-secondary">Ngày hết hạn</p>
							<p class="text-sm font-medium text-white">
								{moment(activeSubscription.expires_at).format('L')}
							</p>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="card rounded-2xl border border-secondary/60 bg-surface p-6 text-center">
				<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 text-muted">
						<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
						<path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
					</svg>
				</div>
				<p class="font-semibold text-primary">Chưa có gói đăng ký đang hoạt động</p>
				<p class="mt-1 text-sm text-muted">Vui lòng liên hệ studio để đăng ký gói hội viên.</p>
			</div>
		{/if}
	</section>

	<!-- Quick links -->
	<section>
		<h2 class="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-muted">
			Truy cập nhanh
		</h2>
		<div class="grid grid-cols-2 gap-3">
			<a
				href="/subscription"
				class="card flex flex-col items-center gap-2 rounded-2xl border border-secondary/60 bg-surface p-5 text-center transition-colors hover:bg-secondary/30"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 text-primary">
						<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
						<path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
					</svg>
				</div>
				<p class="text-sm font-medium text-primary">Gói đăng ký</p>
				<p class="text-xs text-muted">Xem lịch sử gói hội viên</p>
			</a>

			<a
				href="/attendance"
				class="card flex flex-col items-center gap-2 rounded-2xl border border-secondary/60 bg-surface p-5 text-center transition-colors hover:bg-secondary/30"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-success-500/20">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 text-success-700">
						<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
					</svg>
				</div>
				<p class="text-sm font-medium text-primary">Điểm danh</p>
				<p class="text-xs text-muted">Xem lịch sử đến studio của bạn</p>
			</a>

			<a
				href="/branches"
				class="card flex flex-col items-center gap-2 rounded-2xl border border-secondary/60 bg-surface p-5 text-center transition-colors hover:bg-secondary/30"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-warning-500/20">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 text-warning-700">
						<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h-2v2h2V5zm0 4h-2v2h2V9z" clip-rule="evenodd" />
					</svg>
				</div>
				<p class="text-sm font-medium text-primary">Chi nhánh</p>
				<p class="text-xs text-muted">Tìm địa điểm studio</p>
			</a>

			<a
				href="/profile"
				class="card flex flex-col items-center gap-2 rounded-2xl border border-secondary/60 bg-surface p-5 text-center transition-colors hover:bg-secondary/30"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 text-primary">
						<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
					</svg>
				</div>
				<p class="text-sm font-medium text-primary">Hồ sơ</p>
				<p class="text-xs text-muted">Chỉnh sửa thông tin của bạn</p>
			</a>
		</div>
	</section>
</div>
