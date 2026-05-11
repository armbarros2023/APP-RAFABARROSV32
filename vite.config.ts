import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
            changeOrigin: true,
          },
        },
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return;
              if (id.includes('recharts')) return 'charts';
              if (id.includes('@fullcalendar')) return 'calendar';
              if (id.includes('@tanstack')) return 'query-vendor';
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
