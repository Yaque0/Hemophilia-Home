// vite.config.ts (消费者)
import { defineConfig, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { federation } from "@module-federation/vite";

export default defineConfig(<UserConfig>{
  base: "/",
  plugins: [
    vue(),
    federation({
      name: "vite_consumer", // 消费者名称
      remotes: {
        vite_provider: {
          entry: "http://localhost:5173/remoteEntry.js", // 生产者的远程入口文件
          type: "module", // 使用 ES 模块,
          name: "vite_provider", // 生产者的名称
        },
      },
      shared: {
        vue: { requiredVersion: "^3.5.13", singleton: true },
        "vue-router": { requiredVersion: "^4.5.0", singleton: true },
        pinia: { requiredVersion: "^2.3.0", singleton: true },
        "element-plus": { requiredVersion: "^2.9.1", singleton: true },
        axios: { requiredVersion: "^1.7.9", singleton: true },
      },
    }),
  ],
  build: {
    target: "esnext", // 使用最新的 ES 特性
    modulePreload: false, // 禁用模块预加载
    rollupOptions: {
      output: {
        format: "esm", // 输出为 ES 模块
        entryFileNames: "[name].mjs", // 使用 .mjs 扩展名
        chunkFileNames: "assets/[name].mjs",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174, // 消费者的端口，必须与生产者不同
    headers: {
      "Access-Control-Allow-Origin": "*",
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
