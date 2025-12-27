import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		TanStackRouterVite(),
		viteStaticCopy({
			targets: [
				{
					src: normalizePath(path.resolve("./src/assets/locales")),
					dest: normalizePath(path.resolve("./dist")),
				},
			],
		}),
	],
	server: {
		host: true,
		strictPort: true,
		proxy: {
			'/api': {
				target: process.env.DOCKER_ENV 
					? 'http://host.docker.internal:3000'
					: process.env.VITE_API_URL || 'http://localhost:3000',
				changeOrigin: true,
			},
		},
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		css: true,
	},
});
