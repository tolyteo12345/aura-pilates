<script>
	// @ts-nocheck
	import { login } from '$lib/api/auth.js';
	import { authStore } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let fields = $state({ email: '', password: '' });
	let loading = $state(false);
	let error = $state('');

	const onSubmit = async (event) => {
		event.preventDefault();
		if (loading) return;

		loading = true;
		error = '';

		try {
			const data = await login(fields);
			// Support { token, user } or { access_token, user } shapes
			const token = data.token ?? data.access_token;
			const user = data.user ?? data.data;
			authStore.login(token, user);
			toastStore.trigger({
				message: 'Chào mừng trở lại! Đang chuyển hướng...',
				background: 'variant-filled-success'
			});
			goto('/');
		} catch (err) {
			error = err.message ?? 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.';
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Đăng nhập - Aura Studio</title>
</svelte:head>

<h2 class="mb-1 text-2xl font-semibold text-primary">Đăng nhập</h2>
<p class="mb-6 text-sm text-muted">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>

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
		<span class="text-sm text-primary">Mật khẩu</span>
		<input
			class="input mt-1"
			type="password"
			name="password"
			bind:value={fields.password}
			placeholder="••••••••"
			autocomplete="current-password"
			disabled={loading}
			required
		/>
	</label>

	<div class="flex justify-end">
		<a href="/forgot-password" class="text-xs text-primary-hover underline-offset-4 hover:text-primary hover:underline"
			>Quên mật khẩu?</a
		>
	</div>

	<button
		type="submit"
		disabled={loading}
		class="btn variant-filled-primary w-full font-semibold"
	>
		{#if loading}
			<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8v8H4z"
				/>
			</svg>
			Đang đăng nhập...
		{:else}
			Đăng nhập
		{/if}
	</button>
</form>

<p class="mt-4 text-center text-sm text-muted">
	Chưa có tài khoản?
	<a href="/register" class="text-primary-hover underline-offset-4 hover:text-primary hover:underline font-medium">Đăng ký</a>
</p>
