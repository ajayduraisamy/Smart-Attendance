import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()

  ],

  server: {
    host: '0.0.0.0', // This exposes it to your local network
    port: 5173      // You can also change the port here if you want
  },
})