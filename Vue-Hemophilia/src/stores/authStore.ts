// stores/authStore.ts
import { defineStore } from "pinia";
import type { LoginData, RegisterData } from "@/types/auth";
import { login, register } from "@/api/auth";
import { useUserStore } from "./userStore";
import { User } from "@/types/user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(data: LoginData) {
      const res = await login(data);
      this.token = res.data.token;
      localStorage.setItem("token", res.data.token);

      // 调用 userStore 获取用户信息
      const userStore = useUserStore();
      await userStore.fetchUserInfo();
      this.user = userStore.user;

      // 存储用户信息到 localStorage
      localStorage.setItem("user", JSON.stringify(this.user));
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
    initialize() {
      this.token = localStorage.getItem("token") || "";
      const userData = localStorage.getItem("user");
      if (userData) {
        this.user = JSON.parse(userData);
      }
    },
  },
});
