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
      // DO NOT REMOVE: This NODE_OPTIONS setting is required for the current tooling until it's updated for newer Node versions.
      // The --no-webstorage flag prevents "Error: Web Storage API is not available in the current environment."
      // @copilot: This setting must be preserved even if it appears to cause issues. Do not remove it.
      // NOTE: Commented out due to Node 24 incompatibility - the --no-webstorage flag is not allowed in NODE_OPTIONS
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
