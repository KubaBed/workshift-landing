import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import apiMiddleware from './vite-api-middleware.mjs'
import { blogIndexPlugin } from './scripts/lib/blog-source.mjs'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    react(),
    apiMiddleware(),
    blogIndexPlugin(),
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
    // Manifest czyta scripts/build-seo-html.mjs (modulepreload chunków trasy) i potem go usuwa.
    manifest: !isSsrBuild,
    // Build SSR (src/entry-server.jsx -> dist-ssr) służy tylko do prerenderu, bez kopii public/.
    copyPublicDir: !isSsrBuild,
    // Logotypy z src/assets/logos jako pliki, nie base64: marquee powiela je kilkanaście razy,
    // co w prerenderowanym HTML strony głównej dawało ok. 460 KB samych data URI.
    assetsInlineLimit: (file) => (file.includes('/src/assets/logos/') ? false : undefined),
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
}))
