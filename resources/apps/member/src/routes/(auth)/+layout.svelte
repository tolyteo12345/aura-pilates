<script>
	// @ts-nocheck
	import { authStore } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const { children } = $props();

	onMount(() => {
		// If already logged in, redirect to dashboard
		const unsubscribe = authStore.subscribe(($auth) => {
			if ($auth.isAuthenticated) {
				goto('/');
			}
		});
		return unsubscribe;
	});
</script>

<div class="auth-wrapper min-h-screen bg-background">
	<div class="flex min-h-screen flex-col items-center justify-center px-4 py-12">
		<!-- Logo / Brand -->
		<div class="mb-8 text-center">
			<img src="/logo.png" alt="Aura Studio Pilates & Wellness" class="mx-auto h-28 w-auto" />
			<p class="text-sm text-muted">Cổng hội viên</p>
		</div>

		<!-- Auth card -->
		<div class="w-full max-w-sm">
			<div class="card rounded-2xl border border-secondary/60 bg-surface p-6 shadow-sm">
				{@render children()}
			</div>
		</div>
	</div>
</div>
