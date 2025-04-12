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
            class="el-input-custom"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
            class="el-input-custom"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin(loginFormRef)"
            class="el-button-custom"
          >
            登录
          </el-button>
          <el-button @click="goToRegister" class="el-button-custom-secondary">
            注册账号
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue";
  import { type FormInstance } from "element-plus";
  import { useAuthStore } from "@/stores/authStore";
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
  const authStore = useAuthStore();
  const loginFormRef = ref<FormInstance>();

  const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true;
        try {
          await authStore.login(loginForm);
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
  // 定义颜色和字体变量
  $primary-color: #409eff;
  $text-color: #333;
  $border-color: #dcdfe6;
  $background-color: #f5f7fa;
  $card-background: #fff;
  $card-shadow: rgba(0, 0, 0, 0.1);
  $input-background: #f7f9fb;

  // 定义边距和尺寸变量
  $padding: 20px;
  $margin: 20px;
  $border-radius: 10px;
  $avatar-size: 80px;
  $button-height: 40px; // 调整按钮高度
  $button-font-size: 14px; // 调整按钮字体大小

  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: $background-color;
  }

  .login-card {
    width: 100%;
    max-width: 480px;
    padding: $padding;
    border-radius: $border-radius;
    background-color: $card-background;
    box-shadow: 0 2px 10px $card-shadow;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    color: $primary-color;
  }

  .el-form {
    padding: 0;
    .el-form-item {
      margin-bottom: $margin;
    }

    .el-form-item label {
      color: $text-color;
      font-size: 14px;
    }

    .el-input-custom {
      background-color: $input-background;
      border-radius: $border-radius;
      padding: 12px;
    }

    .el-button-custom {
      width: 100%;
      height: $button-height; // 控制按钮高度
      font-size: $button-font-size; // 控制按钮字体大小
      border-radius: $border-radius;
    }

    .el-button-custom-secondary {
      width: 100%;
      height: $button-height; // 控制按钮高度
      font-size: $button-font-size; // 控制按钮字体大小
      background-color: #f0f2f5;
      color: #333;
      border-color: #dcdfe6;
      margin-top: 10px;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .login-container {
      .login-card {
        max-width: 90%;
        padding: 15px;
      }

      .el-button-custom {
        font-size: 13px; // 在小屏幕上减小按钮字体大小
        height: 35px; // 小屏幕时按钮高度适当减小
      }

      .card-title {
        font-size: 20px;
      }
    }
  }
</style>
