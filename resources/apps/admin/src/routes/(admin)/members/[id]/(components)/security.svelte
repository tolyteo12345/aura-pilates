<script>
	// @ts-nocheck
	import { getBearerToken, getErrorMessage, useApi } from '$lib/api';
	import { prevent } from '$lib/prevent';
	import { useToast } from '$lib/toast';

	const toast = useToast();

	const api = useApi({
		Authorization: getBearerToken()
	});

	export let user = { profile: {} };

	let loading = false;

	let fields = {
		password: '',
		password_confirmation: ''
	};

	const onSubmit = () => {
		loading = true;
		api.put(`/users/${user.id}`, fields)
			.then(() => {
				toast.trigger({
					message: 'Đã cập nhật thành công',
					background: 'variant-filled-success'
				});
			})
			.catch((error) => {
				toast.trigger({
					message: getErrorMessage(error),
					background: 'variant-filled-error'
				});
			})
			.finally(() => (loading = false));
	};
</script>

<h3 class="h3 mb-4">Bảo mật và quyền riêng tư</h3>

<!-- Responsive Container (recommended) -->
<form action="" onsubmit={prevent(onSubmit)}>
	<div class="mb-4">
		<label class="label">
			<span>Mật khẩu</span>
			<input
				class="input"
				bind:value={fields.password}
				name="password"
				type="password"
				disabled={loading}
			/>
		</label>
	</div>

	<div class="mb-4">
		<label class="label">
			<span>Xác nhận mật khẩu</span>
			<input
				class="input"
				bind:value={fields.password_confirmation}
				name="password_confirmation"
				type="password"
				disabled={loading}
			/>
		</label>
	</div>

	<div class="flex pt-8">
		<div class="flex-1"></div>
		<button type="submit" class="variant-filled-primary btn mr-2 text-white" disabled={loading}
			>Lưu</button
		>
	</div>
</form>
