import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://blog-serve-production.up.railway.app/', // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
