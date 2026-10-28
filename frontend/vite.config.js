import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/b1-mart': 'http://127.0.0.1:8000',
      '/mobility': 'http://127.0.0.1:8000',
    },
  },
})
