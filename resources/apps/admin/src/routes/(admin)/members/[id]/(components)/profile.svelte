<script>
	// @ts-nocheck
	import { getBearerToken, getErrorMessage, useApi } from '$lib/api';
	import { getAvatarUrl } from '$lib/avatar';
	import { useToast } from '$lib/toast';
	import { Avatar, FileButton, SlideToggle } from '@skeletonlabs/skeleton';

	import CountrySelect from '$lib/components/CountrySelect.svelte';
	import { prevent } from '$lib/prevent';

	const toast = useToast();

	const api = useApi({
		Authorization: getBearerToken()
	});

	let { user, onchange } = $props();

	let loading = $state(false);

	let fields = $state({
		name: user.name,
		contact_number: user.profile.contact_number,
		address: user.profile.address,
		city: user.profile.city,
		state: user.profile.state,
		country: user.profile.country,
		postcode: user.profile.postcode,
		email: user.email,
		newsletter: user.profile.newsletter,
		status: user.status,
		avatar: user.avatar
	});

	const onSubmit = () => {
		loading = true;
		api.put(`/users/${user.id}`, {
			...fields,
			country: fields.country && fields.country.code ? fields.country.code : fields.country
		})
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

	const onChangeFile = (event) => {
		if (event.target.files && event.target.files.length) {
			const file = event.target.files[0];
			const form = new FormData();
			form.append('avatar', file);
			api.post(`/users/${user.id}/avatar`, form)
				.then((response) => {
					user.avatar = response.data.path;
					onChangeAvatar(user.avatar);
				})
				.catch((error) => {
					toast.trigger({
						message: getErrorMessage(error),
						background: 'variant-filled-error'
					});
				})
				.finally(() => (loading = false));
		}
	};
</script>

<h3 class="h3 mb-4">Hồ sơ hội viên</h3>

<!-- Responsive Container (recommended) -->
<form action="" onsubmit={prevent(onSubmit)}>
	<div class="mb-6 flex items-center gap-4 pt-4">
		<Avatar
			src={getAvatarUrl(user.avatar)}
			width="w-24"
			initials={user.initial}
			rounded="rounded-full"
		/>
		<FileButton
			name="files"
			button="btn btn-sm variant-soft-primary"
			accept="image/*"
			onchange={onChangeFile}>Đổi ảnh đại diện</FileButton
		>
	</div>

	<div class="mb-4">
		<label class="label">
			<span>Tên</span>
			<input
				class="input"
				bind:value={fields.name}
				name="name"
				type="text"
				required
				disabled={loading}
			/>
		</label>
	</div>

	<div class="mb-4 flex flex-row gap-4">
		<label class="label flex-1">
			<span>Email</span>
			<input
				class="input"
				bind:value={fields.email}
				name="email"
				type="email"
				required
				readonly
				disabled={loading}
			/>
		</label>
		<label class="label flex-1">
			<span>Trạng thái</span>
			<select class="select" bind:value={fields.status} name="status" disabled={loading}>
				<option value=""></option>
				<option value="active">Đang hoạt động</option>
				<option value="inactive">Ngừng hoạt động</option>
				<option value="suspended">Tạm ngưng</option>
			</select>
		</label>
	</div>

	<div class="mb-4">
		<label class="label">
			<span>Số điện thoại</span>
			<input
				class="input"
				bind:value={fields.contact_number}
				name="contact_number"
				type="tel"
				required
				disabled={loading}
			/>
		</label>
	</div>

	<div class="mb-4">
		<label class="label">
			<span>Địa chỉ</span>
			<input
				class="input"
				bind:value={fields.address}
				name="address"
				type="text"
				required
				disabled={loading}
			/>
		</label>
	</div>

	<div class="mb-4 flex flex-row gap-4">
		<label class="label flex-1">
			<span>Thành phố</span>
			<input
				class="input"
				bind:value={fields.city}
				name="city"
				type="text"
				required
				disabled={loading}
			/>
		</label>
		<label class="label flex-1">
			<span>Tỉnh/Bang</span>
			<input
				class="input"
				bind:value={fields.state}
				name="state"
				type="text"
				required
				disabled={loading}
			/>
		</label>
	</div>

	<div class="mb-4 flex flex-row gap-4">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label flex-1">
			<span>Quốc gia</span>
			<CountrySelect bind:value={fields.country} />
		</label>
		<label class="label flex-1">
			<span>Mã bưu chính</span>
			<input
				class="input"
				bind:value={fields.postcode}
				name="postcode"
				type="text"
				required
				disabled={loading}
			/>
		</label>
	</div>

	<SlideToggle name="slider-label" bind:checked={fields.newsletter}
		>Đăng ký nhận bản tin</SlideToggle
	>

	<div class="flex pt-8">
		<button type="reset" class="variant-filled-error btn text-white" disabled={loading}
			>Đặt lại</button
		>
		<div class="flex-1"></div>
		<button type="submit" class="variant-filled-primary btn mr-2 text-white" disabled={loading}
			>Lưu</button
		>
	</div>
</form>
