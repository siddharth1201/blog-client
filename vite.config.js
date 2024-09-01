import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy API calls to backend server in development
        '/api': {
          target: mode === 'development'
            ? 'https://blog-serve-production.up.railway.app/'
            : 'https://your-production-backend-url.com/', // Modify the production URL if needed
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      // Define build options if needed
    },
    define: {
      // Environment variables can be set here
      'http://localhost:5173/': JSON.stringify(mode === 'development' 
        ? 'https://blog-serve-production.up.railway.app/' 
        : 'https://your-production-backend-url.com/'),
    },
  };
});