import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
		alias: [
			{ find: '$joeysvelte', replacement: './src/joeysvelte/src/lib/' },
		]
	},
	build: {
		sourcemap: true
	}
})
