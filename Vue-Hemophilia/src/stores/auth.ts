import { defineStore } from "pinia";

import type { LoginData, RegisterData } from "@/api/auth";
import { login, register } from "@/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }),

  actions: {
    async login(data: LoginData) {
      const res = await login(data);
      this.token = res.data.token;
      this.user = res.data.token;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    },

    async register(data: RegisterData) {
      const res = await register(data);
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    },

    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
