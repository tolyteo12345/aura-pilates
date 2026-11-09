<script>
	// @ts-nocheck
	import { resetPassword } from '$lib/api/auth.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	// Token and email may come via query params (e.g. ?token=xxx&email=yyy)
	let fields = $state({
		token: $page.url.searchParams.get('token') ?? '',
		email: $page.url.searchParams.get('email') ?? '',
		password: '',
		password_confirmation: ''
	});

	let loading = $state(false);
	let error = $state('');

	const onSubmit = async (event) => {
		event.preventDefault();
		if (loading) return;

		if (fields.password !== fields.password_confirmation) {
			error = 'Mật khẩu xác nhận không khớp.';
			return;
		}

		loading = true;
		error = '';

		try {
			await resetPassword(fields);
			toastStore.trigger({
				message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.',
				background: 'variant-filled-success'
			});
			goto('/login');
		} catch (err) {
			error = err.message ?? 'Đặt lại mật khẩu thất bại. Liên kết có thể đã hết hạn.';
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Đặt lại mật khẩu - Aura Studio</title>
</svelte:head>

<h2 class="mb-1 text-2xl font-semibold text-primary">Đặt lại mật khẩu</h2>
<p class="mb-6 text-sm text-muted">Nhập mật khẩu mới của bạn bên dưới.</p>

{#if error}
	<div class="alert variant-filled-error mb-4 rounded-lg p-3 text-sm">
		{error}
	</div>
{/if}

<form onsubmit={onSubmit} class="flex flex-col gap-4">
	<label class="label">
		<span class="text-sm text-primary">Email</span>
		<input
			class="input mt-1"
			type="email"
			name="email"
			bind:value={fields.email}
			placeholder="you@example.com"
			autocomplete="email"
			disabled={loading}
			required
		/>
	</label>

	<label class="label">
		<span class="text-sm text-primary">Mật khẩu mới</span>
		<input
			class="input mt-1"
			type="password"
			name="password"
			bind:value={fields.password}
			placeholder="••••••••"
			autocomplete="new-password"
			disabled={loading}
			required
			minlength="8"
		/>
	</label>

	<label class="label">
		<span class="text-sm text-primary">Xác nhận mật khẩu mới</span>
		<input
			class="input mt-1"
			type="password"
			name="password_confirmation"
			bind:value={fields.password_confirmation}
			placeholder="••••••••"
			autocomplete="new-password"
			disabled={loading}
			required
			minlength="8"
		/>
	</label>

	<button
		type="submit"
		disabled={loading}
		class="btn variant-filled-primary w-full font-semibold"
	>
		{#if loading}
			<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
			</svg>
			Đang đặt lại...
		{:else}
			Đặt lại mật khẩu
		{/if}
	</button>
</form>

<a href="/login" class="mt-4 block text-center text-sm text-primary-hover underline-offset-4 hover:text-primary hover:underline">
	Quay lại đăng nhập
</a>
