import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()

  ],
  // Development only: send MapServer and MapCache requests to Apache (MS4W) on port 80
  server: {
    proxy: {
      '^/lms(\\?.*)?$': { target: 'http://localhost', changeOrigin: true },
      '/mapcache': { target: 'http://localhost', changeOrigin: true },
    },
  },
})