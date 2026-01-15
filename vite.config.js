import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import cspGuard from 'vite-plugin-csp-guard'
export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
    tailwindcss(),
    cspGuard({
      policy: {
        'default-src': ['*'],
        'connect-src': ['*'],
        'script-src': ['*'],
        'style-src': ['*'],
        'style-src-elem': ['*', "'unsafe-inline'"],
        'font-src': ['*'],
        'img-src': ['*'],
        'media-src': ['*'],
        'frame-src': ['*'],
        'object-src': ['*'],
        'frame-ancestors': ['*'],
        'form-action': ['*'],
        'base-uri': ['*'],
        'child-src': ['*'],
      },
      build: {
        outlierSupport: ['tailwind'],
      },
      override: true,
    }),
  ],
  base: './',
  define: {
    global: 'globalThis',
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
  },
  optimizeDeps: {
    exclude: ['@transcend-io/penumbra'],
  },
})
