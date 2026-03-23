import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Shop/',
  server: {
    port: 3000,
    allowedHosts: 'all',
    proxy: {
      '/backend-api': {
        target: 'https://api.usaidahmad.me',
        changeOrigin: true,
        secure: true,
        // /backend-api/products → https://api.usaidahmad.me/api/products
        rewrite: (path) => path.replace(/^\/backend-api/, '/api'),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'three-vendor':  ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
