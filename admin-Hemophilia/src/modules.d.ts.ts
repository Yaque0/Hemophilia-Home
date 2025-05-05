// modules.d.ts 或 env.d.ts
declare module "vite_provider/LoginView" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vite_provider/RegisterView" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vite_provider/api" {
  const api: any;
  export default api;
}
