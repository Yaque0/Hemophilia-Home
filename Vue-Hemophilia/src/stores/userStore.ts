import { defineStore } from "pinia";
import { getUserProfile } from "@/api/user";
import type { User } from "@/types/user";
import { useAuthStore } from "./authStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null") as User | null,
  }),

  actions: {
    async fetchUserInfo() {
      const res = await getUserProfile();
      this.user = res.data.user;
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const authStore = useAuthStore();
      authStore.user = this.user;
    },

    setUser(user: User | null) {
      this.user = user;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    },
  },
});
