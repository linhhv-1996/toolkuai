import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		headers: {
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Opener-Policy': 'same-origin'
		}
	},
	optimizeDeps: {
		exclude: ['@jsquash/jpeg', '@jsquash/png', '@jsquash/webp', '@jsquash/resize', '@jsquash/oxipng']
	},
	worker: { format: 'es' },
});
