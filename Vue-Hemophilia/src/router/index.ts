import { useAuthStore } from "@/stores/authStore";
import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode as jwt_decode } from "jwt-decode";
const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/index/index.vue"),
  },
  {
    path: "/forum",
    name: "forum",
    component: () => import("@/views/forum/index.vue"),
  },
  {
    path: "/shop",
    name: "shop",
    component: () => import("@/views/shop/index.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/components/RegisterView.vue"),
  },
  {
    path: "/post/:id",
    component: () => import("@/views/forum/components/PostDetail.vue"),
    props: true,
  },
  {
    path: "/post/create",
    component: () => import("@/views/forum/components/PostCreate.vue"),
  },
  // {
  //   path: "/shop",
  //   name: "Shop",
  //   component: Shop,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// ... 其他导入保持不变 ...

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  console.log("当前token:", authStore.token); // 调试日志

  if (to.meta.requiresAuth && !authStore.token) {
    console.log("未登录，跳转到登录页"); // 调试日志
    next("/login?redirect=" + encodeURIComponent(to.fullPath));
    return;
  }

  if (authStore.token) {
    try {
      const decoded: any = (jwt_decode as any)(authStore.token);
      console.log("Token过期时间:", new Date(decoded.exp * 1000)); // 调试日志

      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token已过期，执行登出"); // 调试日志
        authStore.logout();
        next("/login?redirect=" + encodeURIComponent(to.fullPath));
        return;
      }
    } catch (err) {
      console.error("Token解码错误:", err); // 调试日志
      authStore.logout();
      next("/login?redirect=" + encodeURIComponent(to.fullPath));
      return;
    }
  }

  next();
});
export default router;
