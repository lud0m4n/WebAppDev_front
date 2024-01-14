import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/WebAppDev_front',
  server: { 
    port: 3000 ,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // '/pay': {
      //   target: 'http://127.0.0.1:4141',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/pay/, ''),
      // },
}
}})