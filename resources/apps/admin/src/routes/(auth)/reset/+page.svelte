<script>
	// @ts-nocheck
	import { getErrorMessage, useApi } from '$lib/api';
	import { useToast } from '$lib/toast';

	const api = useApi();
	const toast = useToast();

	const { data = { email: '', token: '' } } = $props();

	let fields = $state({ password: '', password_confirmation: '' });

	let loading = $state(false);

	const onSubmit = (event) => {
		event.preventDefault();

		if (loading) return;

		api.post('/auth/reset', {
			email: data.email,
			token: data.token,
			password: fields.password,
			password_confirmation: fields.password_confirmation
		})
			.then(() => {
				toast.trigger({
					message: 'Bạn đã đặt lại mật khẩu thành công. Đang chuyển hướng...',
					background: 'variant-filled-success'
				});
				setTimeout(() => (window.location.href = '/'), 1000);
			})
			.catch((error) => {
				toast.trigger({
					message: getErrorMessage(error),
					background: 'variant-filled-error'
				});
			})
			.finally(() => {
				loading = false;
			});
	};
</script>

<div class="mb-6">
	<h3 class="h3">Đặt lại mật khẩu</h3>
	<p>Vui lòng điền thông tin bên dưới để đặt lại mật khẩu</p>
</div>

<form action="" onsubmit={onSubmit}>
	<div class="mb-6">
		<label class="label">
			<span>Mật khẩu</span>
			<input
				class="input"
				bind:value={fields.password}
				name="password"
				type="password"
				placeholder=""
				disabled={loading}
				required
			/>
		</label>
	</div>
	<div class="mb-6">
		<label class="label">
			<span>Xác nhận mật khẩu</span>
			<input
				class="input"
				bind:value={fields.password_confirmation}
				name="password_confirmation"
				type="password"
				placeholder=""
				disabled={loading}
				required
			/>
		</label>
	</div>
	<button
		type="submit"
		disabled={loading}
		class="variant-filled-primary btn w-full font-bold text-white">Đặt lại mật khẩu</button
	>
	<a href="/login" class="block pt-2 text-center">Quay lại đăng nhập</a>
</form>
