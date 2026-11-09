<script>
	// @ts-nocheck

	import { getBearerToken, getErrorMessage, useApi } from '$lib/api';
	import { getAvatarUrl } from '$lib/avatar';
	import { useToast } from '$lib/toast';
	import { Avatar } from '@skeletonlabs/skeleton';
	import Status from './Status.svelte';
	import SubscriptionCard from './SubscriptionCard.svelte';
	import UserSelect from './UserSelect.svelte';

	let props = $props();
	let user = $state(null);
	let subscriptions = $state([]);
	let type = $state('login');
	let loading = $state(false);
	let branches = $state([]);

	const toast = useToast();

	const api = useApi({
		Authorization: getBearerToken()
	});

	const onChangeUser = (event) => {
		subscriptions = [];
		loadSubscriptions(event.detail.id);
		loadBranches(event.detail.id);
	};

	const loadSubscriptions = (id) => {
		loading = true;
		api.get(`/subscriptions?user_id=${id}`)
			.then((response) => (subscriptions = response.data))
			.catch((error) => {
				toast.trigger({
					message: getErrorMessage(error),
					background: 'variant-filled-error'
				});
			})
			.finally(() => (loading = false));
	};

	const loadBranches = (id) => {
		loading = true;
		api.get(`/users/${id}/branches`)
			.then((response) => (branches = response.data))
			.catch((error) => {
				toast.trigger({
					message: getErrorMessage(error),
					background: 'variant-filled-error'
				});
			})
			.finally(() => (loading = false));
	};

	const onLogActivity = async (event) => {
		try {
			event.preventDefault();

			loading = true;

			let description;

			if (type === 'login') {
				description = `Hội viên ${user.id} : ${user.name} đã vào tập`;
			} else if (type === 'logout') {
				description = `Hội viên ${user.id} : ${user.name} đã rời phòng tập`;
			}

			await api.post('/activities', {
				entity_id: user.id,
				description,
				type: 'attendance'
			});

			toast.trigger({
				// @ts-ignore
				message: description,
				background: 'variant-filled-success'
			});

			loading = false;

			props.load();
		} catch (error) {
			loading = false;
			toast.trigger({
				// @ts-ignore
				message: getErrorMessage(error),
				background: 'variant-filled-error'
			});
		}
	};
</script>

<div class="card flex-1 flex-col bg-surface shadow-lg lg:flex-row">
	<div class="card-header border-b p-4">
		<div class="flex-1 font-bold">Điểm danh hội viên</div>
	</div>
	<div class="card-body p-4">
		<p class="mb-2 block">Vui lòng tìm hội viên để bắt đầu.</p>
		<UserSelect
			searchable
			clearable
			bind:value={user}
			placeholder="Tìm hội viên"
			onChange={onChangeUser}
		/>
		{#if user}
			<div class="pt-4">
				<div class="mb-4 mt-6 flex-1 font-bold">Thông tin hội viên</div>
				<div class="card mb-6 w-full bg-surface shadow-lg">
					<div class="card-body p-4">
						<div class="flex items-center gap-4">
							<Avatar
								src={user.avatar ? getAvatarUrl(user.avatar) : undefined}
								initials={user.avatar ? undefined : user.initial}
								width="w-16"
								rounded="rounded-full"
							/>
							<div>
								<div class="flex flex-row gap-4">
									<a href={`/members/${user.id}`} class="font-bold">{user.name}</a
									>
									<Status status={user.status} />
								</div>
								<a href="mailto:{user.email}" class="text-sm text-muted"
									>{user.email}</a
								>
							</div>
							<div class="flex-1"></div>
							<a href={`/members/${user.id}`} class="variant-filled btn btn-sm">
								Xem hồ sơ
							</a>
						</div>
					</div>
				</div>
				<div class="mb-4 flex-1 font-bold">Gói đăng ký của hội viên</div>
				<div class="grid grid-cols-1 gap-2">
					{#if subscriptions.length}
						<div class="mb-4">
							{#each subscriptions as item}
								<SubscriptionCard {item} action={false} />
							{/each}
						</div>
					{:else}
						<div class="card mb-4 w-full bg-surface shadow-lg">
							<div class="card-body p-4">
								<div class="text-center text-xs text-muted">
									Hội viên này chưa có gói đăng ký nào
								</div>
							</div>
						</div>
					{/if}
				</div>
				<div class="mb-4 flex-1 font-bold">Chi nhánh của hội viên</div>
				<div class="card w-full bg-surface shadow-lg">
					<div class="card-body p-4">
						{#if branches.length}
							<ul class="branches">
								{#each branches as item}
									<li>{item.name}</li>
								{/each}
							</ul>
						{:else}
							<div class="text-center text-xs text-muted">
								Hội viên này chưa thuộc chi nhánh nào
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
	{#if user}
		<div class="flex items-center border-t p-4">
			<form class="flex flex-1 items-center gap-4" onsubmit={onLogActivity}>
				<select class="select" bind:value={type} name="type" required>
					<option value="login">Vào tập (check-in)</option>
					<option value="logout">Ra về (check-out)</option>
				</select>
				<button class="variant-filled btn"> Ghi nhận </button>
			</form>
		</div>
	{/if}
</div>

<style lang="postcss">
	.branches {
		@apply ml-6 list-disc text-sm;
	}
</style>
