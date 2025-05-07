import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    host: true, // Allows access from other devices
    port: 3001, // Default Vite port
})
