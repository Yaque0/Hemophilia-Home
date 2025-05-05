import { defineStore } from "pinia";
import { login as cLogin, register as cRegister } from "vite_provider/api";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("admin-token") || "",
    user: JSON.parse(localStorage.getItem("admin-user") || "null"),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(data: { email: string; password: string; isAdmin: boolean }) {
      const response = await cLogin(data);
      this.token = response.token;
      this.user = response.user;

      localStorage.setItem("admin-token", response.token);
      localStorage.setItem("admin-user", JSON.stringify(response.user));
    },

    async register(data: {
      email: string;
      password: string;
      username: string;
      role: string;
    }) {
      const response = await cRegister({
        ...data,
        role: "admin", // 强制设置为管理员
      });

      this.token = response.token;
      this.user = response.user;

      localStorage.setItem("admin-token", response.token);
      localStorage.setItem("admin-user", JSON.stringify(response.user));

      const router = useRouter();
      router.push("/");
    },

    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("admin-token");
      localStorage.removeItem("admin-user");
    },
  },
});
