import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import ElementPlus from 'unplugin-element-plus/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, Plugin } from 'vite';

const SQLiteDevPlugin = (): Plugin => {
  return {
    name: 'configure-response-headers',
    configureServer: (server) => {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        next();
      });
    },
  };
};

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
    SQLiteDevPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['sqlocal'],
  },
});
