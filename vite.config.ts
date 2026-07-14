import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("firebase")) return "vendor-firebase";
          if (
            id.includes("leaflet") ||
            id.includes("react-leaflet")
          ) {
            return "vendor-leaflet";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) {
            return "vendor-react";
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/hooks/**", "src/components/**"],
      exclude: ["src/main.tsx", "src/test/**"],
    },
  },
})
