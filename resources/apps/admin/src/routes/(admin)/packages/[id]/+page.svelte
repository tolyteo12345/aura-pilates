<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getBearerToken, getErrorMessage, useApi } from '$lib/api';
	import CycleSelect from '$lib/components/CycleSelect.svelte';
	import ServiceSelect from '$lib/components/ServiceSelect.svelte';
	import { prevent } from '$lib/prevent';
	import { useToast } from '$lib/toast';
	import { onMount } from 'svelte';

	const toast = useToast();

	const api = useApi({
		Authorization: getBearerToken()
	});

	let title = 'Sửa gói tập';

	let loading = false;

	let fields = {
		name: '',
		status: 'active',
		amount: '',
		cycle: null,
		services: []
	};

	const onSubmit = () => {
		loading = true;
		api.put(`/packages/${$page.params.id}`, {
			name: fields.name,
			status: fields.status,
			amount: fields.amount,
			cycle_id: fields.cycle ? fields.cycle.id : null,
			services: fields.services.map((v) => v.id)
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

	const loadItem = () => {
		loading = true;
		api.get(`/packages/${$page.params.id}`)
			.then((response) => {
				const value = response.data;
				fields = {
					name: value.name,
					status: value.status,
					amount: value.amount,
					cycle: value.cycle,
					services: value.services
				};
			})
			.catch((error) => {
				toast.trigger({
					message: getErrorMessage(error),
					background: 'variant-filled-error'
				});
				goto('/packages');
			})
			.finally(() => (loading = false));
	};

	onMount(() => {
		loadItem();
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="p-4 lg:max-w-1200 lg:p-6">
	<div class="card bg-surface p-4 lg:p-6">
		<header class="card-header mb-6 flex items-center">
			<h3 class="h3">{title}</h3>
			<div class="flex-1"></div>
		</header>
		<!-- Responsive Container (recommended) -->
		<form action="" onsubmit={prevent(onSubmit)}>
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

			<div class="mb-4">
				<label class="label">
					<span>Giá</span>
					<input
						class="input"
						bind:value={fields.amount}
						name="amount"
						type="number"
						required
						disabled={loading}
					/>
				</label>
			</div>

			<div class="mb-4">
				<label class="label">
					<span>Trạng thái</span>
					<select
						class="select"
						bind:value={fields.status}
						name="status"
						required
						disabled={loading}
					>
						<option value=""></option>
						<option value="active">Đang hoạt động</option>
						<option value="inactive">Ngừng hoạt động</option>
					</select>
				</label>
			</div>

			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label flex flex-col gap-1">
					<span>Chu kỳ thanh toán</span>
					<CycleSelect bind:value={fields.cycle} />
				</label>
			</div>

			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label flex flex-col gap-1">
					<span>Dịch vụ</span>
					<ServiceSelect bind:value={fields.services} />
				</label>
			</div>

			<div class="flex">
				<button
					type="button"
					onclick={() => goto('/packages')}
					class="variant-filled-error btn text-white"
					disabled={loading}>Hủy</button
				>
				<div class="flex-1"></div>
				<button
					type="submit"
					class="variant-filled-primary btn mr-2 text-white"
					disabled={loading}>Lưu</button
				>
			</div>
		</form>
	</div>
</div>
