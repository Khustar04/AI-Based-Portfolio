import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('motion')) return 'motion';
            if (id.includes('lenis')) return 'lenis';
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/')) return 'react-core';
            if (id.includes('react-easy-crop')) return 'admin-cropper';
            return 'vendor';
          }
        },
      },
    },
  },
})
