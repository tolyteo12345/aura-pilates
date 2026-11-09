import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	// Bundle moment for SSR too, so 'moment/dist/locale/vi' (ESM) registers on the same instance
	ssr: { noExternal: ['moment'] },
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.png', 'logo.png', 'icons/*.png'],
			manifest: {
				name: 'Aura Studio Member',
				short_name: 'Aura',
				description: 'Cổng hội viên Aura Studio Pilates & Wellness - quản lý gói tập, điểm danh và hồ sơ của bạn',
				theme_color: '#F5F0E8',
				background_color: '#F5F0E8',
				display: 'standalone',
				start_url: '/',
				scope: '/',
				icons: [
					{
						src: '/icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
				runtimeCaching: [
					{
						urlPattern: /^https?.*\/api\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'api-cache',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24
							},
							networkTimeoutSeconds: 10
						}
					}
				]
			}
		})
	],
	server: {
		port: 5174,
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true
			}
		}
	}
});
