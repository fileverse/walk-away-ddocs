import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import copy from 'rollup-plugin-copy'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
    tailwindcss(),
    copy({
      targets: [
        {
          src: 'node_modules/@transcend-io/penumbra/dist/worker.penumbra.js',
          dest: 'public',
          transform: (contents) => {
            return contents
          },
        },
      ],
      hook: 'buildStart',
    }),
  ],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['@transcend-io/penumbra'], // Ensure it's included
  },
})
