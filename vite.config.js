import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import apiMiddleware from './vite-api-middleware.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    apiMiddleware(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Forma funkcji, nie obiektu: obiekt łapie tylko wejścia paczek, więc rdzeń Reacta lądował
        // w vendor-motion, react-dom i scheduler w głównym index (nowy hash przy każdym deployu),
        // a gsap/ScrollTrigger w index zamiast w vendor-gsap.
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return undefined;
          if (/\/node_modules\/three\//.test(id)) return 'vendor-three';
          if (/\/node_modules\/(framer-motion|motion|motion-dom|motion-utils|tslib)\//.test(id)) return 'vendor-motion';
          if (/\/node_modules\/gsap\//.test(id)) return 'vendor-gsap';
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
          return undefined;
        },
      },
    },
  },
})
