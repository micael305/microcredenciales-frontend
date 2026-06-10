import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  // Configuración de pruebas unitarias (Vitest).
  // 'node' alcanza para funciones puras como utils/blockchain.js.
  test: {
    environment: 'node',
  },
})
