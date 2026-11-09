<script>
	// @ts-nocheck

	import { useToast } from '$lib/toast';

	import axios from 'axios';

	const toast = useToast();

	let fields = $state({ email: '', password: '' });

	let loading = $state(false);

	const onSubmit = (event) => {
		event.preventDefault();
		if (loading) return;
		axios
			.post('/login', fields)
			.then(() => {
				toast.trigger({
					message: 'Bạn đã đăng nhập thành công. Đang chuyển hướng...',
					background: 'variant-filled-success'
				});
				setTimeout(() => (window.location.href = '/'), 1500);
			})
			.catch((error) => {
				toast.trigger({
					message: 'Không thể đăng nhập. Vui lòng thử lại.',
					background: 'variant-filled-error'
				});
			})
			.finally(() => {
				loading = false;
			});
	};
</script>

<div class="mb-6">
	<h3 class="h3">Đăng nhập tài khoản</h3>
	<p>Vui lòng đăng nhập để bắt đầu</p>
</div>

<form action="" onsubmit={onSubmit}>
	<div class="mb-4">
		<label class="label">
			<span>Email</span>
			<input
				class="input"
				bind:value={fields.email}
				name="email"
				type="email"
				disabled={loading}
				placeholder="john@doe.com"
				required
			/>
		</label>
	</div>

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
	<button
		type="submit"
		disabled={loading}
		class="variant-filled-primary btn w-full font-bold text-white">Đăng nhập</button
	>
	<a href="/forgot" class="block pt-2 text-center">Quên mật khẩu</a>
</form>
