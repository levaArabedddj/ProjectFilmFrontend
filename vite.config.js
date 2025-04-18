import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth': { // ✅ Должно соответствовать API-бэкенду
        target: 'http://localhost:8080/',
        changeOrigin: true,
        secure: false
      },
      '/Film': { // для запросов к кинофильму
    target: 'http://localhost:8080/',
    changeOrigin: true,
    secure: false
    }, 
    '/Finance': { // для запросов к финансам
      target:'http://localhost:8080/',
      changeOrigin: true,
      secure: false
    },
    '/ShootingDay':{
      target:'http://localhost:8080/',
      changeOrigin: true,
      secure: false
    },
    '/Script':{
      target:'http://localhost:8080/',
      changeOrigin: true,
      secure: false
    }, 
    '/casting':{
      target:'http://localhost:8080/',
      changeOrigin: true,
      secure: false
    }
    }
  }, 
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

