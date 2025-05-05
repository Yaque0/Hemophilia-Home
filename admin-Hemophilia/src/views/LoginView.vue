<template>
  <div class="login-container">
    <Suspense>
      <template #default>
        <MainAppLoginView
          @login="handleAdminLogin"
          @go-to-register="handleGoToRegister"
        />
      </template>
      <template #fallback>
        <div>Loading login component...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useAuthStore } from "@/store/authStore";
import router from "@/router";

// 移除顶层await的import
const MainAppLoginView = defineAsyncComponent(() =>
  import("vite_provider/LoginView").then((m) => m.default || m)
);

const authStore = useAuthStore();

const handleAdminLogin = async (loginData: {
  email: string;
  password: string;
}) => {
  await authStore.login({
    ...loginData,
    isAdmin: true,
  });
};
const handleGoToRegister = () => {
  router.push("/register");
};
</script>
