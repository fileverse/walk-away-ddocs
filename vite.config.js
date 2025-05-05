import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import copy from 'rollup-plugin-copy'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [
    nodePolyfills(),
    wasm(),
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
  optimizeDeps: {
    exclude: ['@transcend-io/penumbra'],
  },
  resolve: {
    alias: {
      '@argon2-browser': 'node_modules/argon2-browser/dist/argon2.js',
    },
  },
})
