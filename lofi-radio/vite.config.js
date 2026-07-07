import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'lofi-radio-logo-blue.webp',
        'robots.txt',
        'sitemap.xml',
      ],
      manifest: {
        name: 'Lofi Music Radio',
        short_name: 'Lofi Radio',
        description:
          'Listen to the best lofi music without interruptions. Free online radio with varied stations, customizable themes, and no ads.',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        lang: 'en',
        categories: ['music', 'entertainment'],
        icons: [
          {
            src: '/lofi-radio-logo-blue.webp',
            sizes: '192x192',
            type: 'image/webp',
            purpose: 'any',
          },
          {
            src: '/lofi-radio-logo-blue.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any',
          },
          {
            src: '/lofi-radio-logo-blue.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: '/lofi-radio-logo-blue.webp',
            sizes: '512x512',
            type: 'image/webp',
            form_factor: 'wide',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,gif,json,svg,xml,txt}'],
        // Allow large GIFs (will be optimized to video in FASE 5)
        maximumFileSizeToCacheInBytes: 7 * 1024 * 1024, // 7 MB
        runtimeCaching: [
          {
            // Stations JSON — network first to always get fresh station data
            urlPattern: /\/stations\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'stations-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 }, // 24h
            },
          },
          {
            // Background images — stale while revalidate
            urlPattern: /\.(?:webp|gif|png|jpg|jpeg|svg)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            },
          },
          {
            // YouTube IFrame API — network first (needs live connection)
            urlPattern: /^https:\/\/www\.youtube\.com\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'youtube-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 }, // 24h
            },
          },
          {
            // Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            // Google Fonts files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'intl-vendor': ['react-intl'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['react-icons'],
        },
      },
    },
  },
});
