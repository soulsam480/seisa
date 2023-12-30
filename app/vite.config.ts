import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

function SQLiteDevPlugin(): Plugin {
  return {
    name: 'configure-response-headers',
    configureServer: (server) => {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    ElementPlus({}),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ph'],
        }),
      ],
      dts: true,
      dirs: [],
    }),
    Icons({
      autoInstall: true,
    }),
    SQLiteDevPlugin(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,ico,wasm}'],
      },
      manifest: {
        name: 'Seisa',
        short_name: 'Seisa',
        description: 'Track personal finances',
        theme_color: '#14A670',
        background_color: '#14A670',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['sqlocal'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'lightningcss',
  },
})
