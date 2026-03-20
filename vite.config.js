import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Shop/',
  server: {
    port: 3000,
    middlewareMode: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        bigint: true,
        'top-level-await': true,
      },
    },
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'three',
    ],
    exclude: ['@react-three/fiber', '@react-three/drei'],
  },
  build: {
    chunkSizeWarningLimit: 1500,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'three-vendor': ['three'],
        },
      },
    },
  },
})
