import { resolve } from 'node:path'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		tsconfigPaths: true
	},
	plugins: [
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		tailwindcss()
	],
	build: {
		rolldownOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				picker: resolve(__dirname, 'picker.html')
			}
		}
	},

	dev: {
		sourcemap: true
	}
})
