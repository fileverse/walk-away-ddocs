import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  plugins: [
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
})
