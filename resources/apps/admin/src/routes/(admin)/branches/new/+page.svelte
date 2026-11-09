<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getErrorMessage } from '$lib/api';
	import { createBranchStoreContext } from '$lib/stores/branches.store.svelte';
	import { useToast } from '$lib/toast';

	const toast = useToast();

	const title = 'Thêm chi nhánh';

	const store = createBranchStoreContext();

	let loading = $state(false);

	let fields = $state({
		name: '',
		status: 'active',
		description: ''
	});

	const onSubmit = (event) => {
		event.preventDefault();
		loading = true;
		store
			.createBranch(fields)
			.then(() => {
				goto('/branches');
				toast.trigger({
					message: 'Đã tạo thành công',
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
		<form action="" onsubmit={onSubmit}>
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
				<label class="label">
					<span>Mô tả</span>
					<textarea
						class="textarea"
						rows="4"
						bind:value={fields.description}
						name="description"
						required
						disabled={loading}
					></textarea>
				</label>
			</div>

			<div class="flex">
				<button
					type="button"
					onclick={() => goto('/branches')}
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
