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
          <div class="admin-login-tip">
            管理员请
            <el-button
              type="text"
              @click="$emit('go-to-admin-login')"
              style="padding: 0 4px"
            >
              点击此处登录
            </el-button>
          </div>
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

<style lang="scss" scoped>
  $primary-color: #f28a8c;
  $secondary-color: #409eff;
  $text-color: #606266;
  $secondary-color: #409eff;

  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

    .login-card {
      width: 480px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      padding: 30px;

      .card-title {
        text-align: center;
        color: $primary-color;
        font-size: 24px;
        margin-bottom: 30px;
      }

      :deep(.el-form-item) {
        margin-bottom: 25px;

        .el-form-item__label {
          color: $text-color;
          font-weight: 500;
        }

        .el-input__inner {
          border-radius: 8px;
          padding: 12px 15px;
          transition: all 0.3s ease;

          &:hover {
            border-color: $primary-color;
          }

          &:focus {
            border-color: $primary-color;
            box-shadow: 0 0 8px rgba($primary-color, 0.2);
          }
        }
      }

      .el-button-custom {
        width: 100%;
        background: $primary-color;
        border: none;
        transition: all 0.3s ease;
        padding: 12px;
        font-size: 16px;

        &:hover {
          background: darken($primary-color, 10%);
          transform: translateY(-2px);
        }
      }

      .admin-login-tip {
        text-align: center;
        margin-top: 20px;
        color: $text-color;

        .el-button {
          color: $secondary-color;
          font-weight: 500;

          &:hover {
            color: $secondary-color, 15%;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .login-container {
      padding: 20px;

      .login-card {
        width: 100%;
        box-shadow: none;
        padding: 20px;
      }
    }
  }
</style>
