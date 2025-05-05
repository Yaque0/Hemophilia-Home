<template>
  <div class="register-container">
    <Suspense>
      <template #default>
        <MainAppRegisterView
          @register="handleAdminRegister"
          @go-to-login="handleGoToLogin"
        />
      </template>
      <template #fallback>
        <div class="loading-placeholder">
          <el-icon class="loading-icon"><Loading /></el-icon>
          正在加载注册组件...
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useAuthStore } from "@/store/authStore";
import { Loading } from "@element-plus/icons-vue";
import router from "@/router";

// 移除未使用的类型声明
const MainAppRegisterView = defineAsyncComponent(() =>
  import("vite_provider/RegisterView").then((m) => m.default || m)
);

const authStore = useAuthStore();

const handleAdminRegister = async (registerData: {
  email: string;
  password: string;
  username: string;
}) => {
  await authStore.register({
    ...registerData,
    role: "admin",
  });
};
// 添加跳转登录方法
const handleGoToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-icon {
  margin-right: 8px;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
