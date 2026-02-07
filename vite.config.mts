/// <reference types="vitest" />

import Vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import Fonts from 'unplugin-fonts/vite';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import Layouts from 'vite-plugin-vue-layouts-next';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    Layouts(),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
  },
  test: {
    coverage: {
      provider: 'v8',
      exclude: [
        ...configDefaults.exclude,
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'package.json',
        'src/**/__mocks__',
        'src/models',
        'src/plugins',
        'src/router',
        'src/*.vue',
        'src/*.ts',
        'src/composables/firebase-app.ts',
      ],
    },
    clearMocks: true,
    env: {
      // NOTE: The NODE_OPTIONS setting with --no-webstorage flag has been commented out
      // due to Node 24 incompatibility. Node 24+ does not allow --no-webstorage in NODE_OPTIONS.
      // The original setting was intended to prevent "Error: Web Storage API is not available"
      // but is no longer needed or compatible with current Node versions.
      // If you encounter web storage errors, consider alternative solutions compatible with Node 24+.
      // NODE_OPTIONS: '--no-webstorage',
    },
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    setupFiles: './vitest.setup.ts',
  },
});
