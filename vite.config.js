import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: isSsrBuild
        ? {}
        : {
              rollupOptions: {
                  output: {
                      manualChunks(id) {
                          if (!id.includes('node_modules')) return;
                          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
                              return 'react-vendor';
                          }
                          if (/[\\/]node_modules[\\/](@inertiajs|axios|ziggy-js)[\\/]/.test(id)) {
                              return 'inertia-vendor';
                          }
                          if (/[\\/]node_modules[\\/](pusher-js|laravel-echo)[\\/]/.test(id)) {
                              return 'realtime-vendor';
                          }
                          if (/[\\/]node_modules[\\/]swiper[\\/]/.test(id)) {
                              return 'swiper-vendor';
                          }
                      },
                  },
              },
          },
}));
