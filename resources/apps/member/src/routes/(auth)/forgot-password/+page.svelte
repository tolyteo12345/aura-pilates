<script>
	// @ts-nocheck
	import { forgotPassword } from '$lib/api/auth.js';

	let email = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	const onSubmit = async (event) => {
		event.preventDefault();
		if (loading) return;

		loading = true;
		error = '';

		try {
			await forgotPassword({ email });
			success = true;
		} catch (err) {
			error = err.message ?? 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.';
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Quên mật khẩu - Aura Studio</title>
</svelte:head>

<h2 class="mb-1 text-2xl font-semibold text-primary">Quên mật khẩu</h2>
<p class="mb-6 text-sm text-muted">
	Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
</p>

{#if success}
	<div class="alert variant-filled-success rounded-lg p-4 text-sm">
		<p class="font-semibold">Vui lòng kiểm tra hộp thư!</p>
		<p class="mt-1">
			Nếu tồn tại tài khoản với email <strong>{email}</strong>, bạn sẽ sớm nhận được liên kết
			đặt lại mật khẩu.
		</p>
	</div>
	<a href="/login" class="btn variant-soft mt-4 w-full"> Quay lại đăng nhập </a>
{:else}
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
				bind:value={email}
				placeholder="you@example.com"
				autocomplete="email"
				disabled={loading}
				required
			/>
		</label>

		<button
			type="submit"
			disabled={loading}
			class="btn variant-filled-primary w-full font-semibold"
		>
			{#if loading}
				<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
				</svg>
				Đang gửi...
			{:else}
				Gửi liên kết đặt lại
			{/if}
		</button>
	</form>

	<a href="/login" class="mt-4 block text-center text-sm text-primary-hover underline-offset-4 hover:text-primary hover:underline">
		Quay lại đăng nhập
	</a>
{/if}
