import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_DEMO=1 builds a design preview with placeholder branding: the data
// module is swapped for site.demo.ts and the page title is neutralized.
const demo = process.env.VITE_DEMO === '1'

export default defineConfig({
  plugins: [
    react(),
    demo && {
      name: 'demo-html',
      transformIndexHtml: (html: string) =>
        html
          .replace(/<title>.*<\/title>/, '<title>Construction Site Concept</title>')
          .replace(/<meta\s+name="description"[\s\S]*?\/>/, '<meta name="description" content="Design preview for a construction company website." />'),
    },
  ],
  resolve: {
    alias: demo ? [{ find: /^(\.{1,2}\/)+data\/site$/, replacement: fileURLToPath(new URL('./src/data/site.demo.ts', import.meta.url)) }] : [],
  },
  build: { chunkSizeWarningLimit: 1600 },
})
