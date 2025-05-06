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
    path: "/forum/post/:id",
    name: "PostDetail",
    component: () => import("@/views/forum/components/PostDetail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/shop",
    name: "shop",
    component: () => import("@/views/shop/index.vue"),
    meta: { requiresAuth: false },
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

  {
    path: "/news/create",
    name: "news-create",
    component: () => import("@/views/index/components/CreatNews.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/news/:id",
    name: "news-detail",
    component: () => import("@/views/index/components/NewsDetail.vue"),
  },
  {
    path: "/news",
    name: "news",
    component: () => import("@/views/index/components/NewsList.vue"),
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
      return;
    }

    try {
      // 检查token是否有效
      const decoded: any = jwt_decode(authStore.token);
      if (decoded.exp * 1000 < Date.now()) {
        // 可以在这里添加token刷新逻辑
        throw new Error("Token expired");
      }
    } catch (err) {
      authStore.logout();
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
      return;
    }
  }

  next();
});
export default router;
