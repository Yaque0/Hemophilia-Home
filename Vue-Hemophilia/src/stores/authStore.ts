// stores/authStore.ts
import { defineStore } from "pinia";
import type { LoginData, RegisterData } from "@/api/auth";
import { login, register } from "@/api/auth";
import { useUserStore } from "./userStore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
  }),

  actions: {
    async login(data: LoginData) {
      const res = await login(data);
      this.token = res.data.token;
      localStorage.setItem("token", res.data.token);

      // 调用 userStore 获取用户信息
      const userStore = useUserStore();
      await userStore.fetchUserInfo();
    },

    async register(data: RegisterData) {
      const res = await register(data);
      this.token = res.data.token;
      localStorage.setItem("token", res.data.token);

      const userStore = useUserStore();
      await userStore.fetchUserInfo();
    },

    logout() {
      this.token = "";
      localStorage.removeItem("token");

      const userStore = useUserStore();
      userStore.setUser(null);
    },
  },
});
