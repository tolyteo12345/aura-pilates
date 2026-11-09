<script>
	// @ts-nocheck
	import '../app.pcss';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	import moment from 'moment';
	import 'moment/dist/locale/vi';

	moment.locale('vi');
	initializeStores();

	const { children } = $props();
</script>

<Toast />

{@render children()}
