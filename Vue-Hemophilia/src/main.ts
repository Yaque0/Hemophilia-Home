import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";

import App from "./App.vue";
import router from "./router/index";

const app = createApp(App);
const pinia = createPinia();

// 必须先注册 Pinia
app.use(pinia);

// 现在可以安全地使用 store
import { useAuthStore } from "./stores/authStore";
const authStore = useAuthStore();

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);
app.use(ElementPlus);
authStore.initialize();

app.mount("#app");
