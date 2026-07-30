import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'نظام البقالات المحاسبي',
        short_name: 'البقالات',
        description: 'نظام محاسبي متكامل لإدارة البقالات',
        theme_color: '#15803D',
        background_color: '#F4F7F5',
        display: 'standalone',
        orientation: 'portrait',
        dir: 'rtl',
        lang: 'ar',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
