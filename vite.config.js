import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  // Configuración de pruebas (Vitest).
  // jsdom: necesario para los tests de componentes React (DOM simulado).
  // Las pruebas de funciones puras (utils/blockchain.js) también corren aquí.
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
