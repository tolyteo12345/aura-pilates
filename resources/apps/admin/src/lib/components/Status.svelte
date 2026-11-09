<script>
	// @ts-nocheck
	let { status } = $props();

	let badgeStyle = $derived.by(() => {
		return (
			{
				active: 'variant-filled-success text-white',
				inactive: 'variant-filled-warning',
				suspended: 'variant-filled-secondary',
				expired: 'variant-filled-tertiary text-white'
			}[status] || 'variant-filled-primary text-white'
		);
	});

	let label = $derived(
		{
			active: 'Đang hoạt động',
			inactive: 'Ngừng hoạt động',
			suspended: 'Tạm ngưng',
			expired: 'Hết hạn',
			deleted: 'Đã xóa',
			cancelled: 'Đã hủy'
		}[status] || status
	);
</script>

<span class={`badge ${badgeStyle}`}>
	{label}
</span>
