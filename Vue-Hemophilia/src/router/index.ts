import { createRouter, createWebHistory } from "vue-router";

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

export default router;
