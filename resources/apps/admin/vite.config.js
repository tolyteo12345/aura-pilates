import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	// Bundle moment for SSR too, so 'moment/dist/locale/vi' (ESM) registers on the same instance
	ssr: { noExternal: ['moment'] },
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
