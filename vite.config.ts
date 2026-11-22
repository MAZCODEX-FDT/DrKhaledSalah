import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoFiles } from './seo.config.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('recharts') || id.includes('d3-')) return 'charts'
          if (id.includes('gsap') || id.includes('lenis')) return 'motion-gsap'
        },
      },
    },
  },
})
