<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="card-title">登录</h2>
      </template>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="请输入邮箱"
            type="email"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin(loginFormRef)"
          >
            登录
          </el-button>
          <el-button @click="goToRegister">注册账号</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue";
  import { type FormInstance } from "element-plus";
  import { useAuthStore } from "@/stores/auth";
  import { useRouter } from "vue-router";
  const loginForm = reactive({
    email: "",
    password: "",
  });
  const rules = {
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      { type: "email", message: "请输入正确的邮箱", trigger: "blur" },
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  };

  const loading = ref(false);
  const router = useRouter();
  const anthStore = useAuthStore();
  const loginFormRef = ref<FormInstance>();
  const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true;
        try {
          await anthStore.login(loginForm);
          // 登录成功，跳转到首页
          router.push("/");
        } catch (error) {
          // 处理登录错误
          console.error("登录失败", error);
        } finally {
          loading.value = false;
        }
      }
    });
  };
  const goToRegister = () => {
    router.push("/register");
  };
</script>
<style scoped lang="scss">
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f7fa;
  }

  .login-card {
    width: 100%;
    max-width: 480px;
  }

  .card-title {
    text-align: center;
    margin: 0;
    color: #303133;
  }

  :deep(.el-form-item__content) {
    justify-content: center;
  }
</style>
