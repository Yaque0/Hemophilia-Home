import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/views/AdminLayout.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/",
    component: AdminLayout,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/DashboardView.vue"),
      },
      {
        path: "users",
        name: "UserManagement",
        component: () => import("@/views/UserManagementView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
