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
        'style-src': ['*', "'self'", "'unsafe-inline'"],
        'style-src-elem': ['*', "'unsafe-inline'"],
        'font-src': ['*', "'self'", 'data:'],
        'img-src': ['*', 'data:', 'blob:'],
        'media-src': ['*'],
        'frame-src': ['*'],
        'object-src': ['*'],
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
