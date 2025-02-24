import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig(
  ({ command, mode }: { command: string; mode: string }) => {
    const config = {
      base: '/easevoice',
      plugins: [TanStackRouterVite(), react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    }
    if (command === 'serve') {
      const env = loadEnv(mode, process.cwd())
      return {
        ...config,
        server: {
          port: 5173,
          proxy: {
            '^/api': {
              target: env.VITE_API_BASE_URL,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        },
      }
    } else {
      return {
        ...config,
        esbuild: {
          drop: ['console', 'debugger'],
        },
      }
    }
  }
)
