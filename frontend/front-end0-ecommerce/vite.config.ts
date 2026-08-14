import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Untitled UI components import each other via "@/..."
      '@': path.resolve(import.meta.dirname, 'src'),
      '@shared': path.resolve(import.meta.dirname, 'src/shared'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
      '@features': path.resolve(import.meta.dirname, "src/features"),
      "@routes": path.resolve(import.meta.dirname, "src/routes"),
      "@layouts": path.resolve(import.meta.dirname, "src/layouts")
    },
  },
})
