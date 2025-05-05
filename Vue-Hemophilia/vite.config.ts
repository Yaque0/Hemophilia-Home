import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { federation } from "@module-federation/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "vite_provider", // 生产者名称
      filename: "remoteEntry.js", // 远程入口文件名
      exposes: {
        // 将组件暴露给消费者使用
        "./AuthStore": "./src/stores/authStore.ts",
        "./UserStore": "./src/stores/userStore.ts",
        "./api": "./src/api",
        "./RichEditor": "./src/components/yEditor/RichEditor.vue",
        "./NewsCreate": "./src/views/index/components/CreatNews.vue",
        "./PostCreate": "./src/views/forum/components/PostCreate.vue",
        "./LoginView": "./src/components/LoginView.vue",
        "./RegisterView": "./src/components/RegisterView.vue",
      },
      shared: {
        vue: { requiredVersion: "^3.5.13", singleton: true },
        "vue-router": { requiredVersion: "^4.5.0", singleton: true },
        pinia: { requiredVersion: "^2.3.0", singleton: true },
        "element-plus": { requiredVersion: "^2.9.1", singleton: true },
        axios: { requiredVersion: "^1.7.9", singleton: true },
      },
      // 强制使用 module 模式
      library: {
        type: "module", // 使用 ES 模块
      },
    }),
  ],
  build: {
    target: "esnext", // 使用最新的 ES 特性
    outDir: "dist", // 构建输出目录
    sourcemap: false, // 禁用 sourcemap
    minify: "terser", // 使用 terser 进行代码压缩
    modulePreload: false, // 禁用模块预加载
    rollupOptions: {
      output: {
        format: "esm", // 输出为 ES 模块
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].mjs",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
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
