import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import federation from "@originjs/vite-plugin-federation";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "main-app",
      filename: "remoteEntry.js",
      exposes: {
        "./AuthStore": "./src/stores/authStore.ts",
        "./UserStore": "./src/stores/userStore.ts",
        "./api": "./src/api",
      },
      shared: ["vue", "vue-router", "pinia", "element-plus", "axios"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:color"; @use "sass:map";`,
      },
    },
  },
});
