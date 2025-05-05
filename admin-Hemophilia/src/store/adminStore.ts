import { defineStore } from "pinia";
import getAdminApi from "@/utils/request";
import type { User } from "@/types/user";
export const useAdminStore = defineStore("admin", {
  actions: {
    async getUsers(params: any): Promise<{ users: User[]; total: number }> {
      const api = getAdminApi.create();
      return api.get("/admin/users", { params });
    },
    async updateUser(id: number, data: Partial<User>) {
      const api = getAdminApi.create();
      return api.put(`/admin/users/${id}`, data);
    },
    async resetPassword(id: number) {
      const api = getAdminApi.create();
      return api.post(`/admin/users/${id}/reset-password`);
    },
  },
});
