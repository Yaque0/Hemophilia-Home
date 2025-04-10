<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2 class="card-title">注册</h2>
      </template>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            type="email"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号（选填）"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleRegister(registerFormRef)"
          >
            注册
          </el-button>
          <el-button @click="goToLogin">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue";
  import { ElMessage, type FormInstance } from "element-plus";
  import { useAuthStore } from "@/stores/auth";
  import router from "@/router";

  const registerForm = reactive({
    email: "",
    password: "",
    username: "",
    phone: "",
  });

  const rules = {
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      {
        type: "email",
        message: "请输入正确的邮箱格式",
        trigger: ["blur", "change"],
      },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 6, message: "密码长度至少为6位", trigger: "blur" },
    ],
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    phone: [
      {
        pattern: /^1[3456789]\d{9}$/,
        message: "请输入正确的手机号",
        trigger: "blur",
      },
    ],
  };

  const loading = ref(false);

  const authStore = useAuthStore();
  const registerFormRef = ref<FormInstance>();
  const handleRegister = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true;
        try {
          await authStore.register(registerForm);
          ElMessage.success("注册成功，请登录");
          router.push("/login");
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || "注册失败");
        } finally {
          loading.value = false;
        }
      }
    });
  };
  const goToLogin = () => {
    router.push("/login");
  };
</script>

<style scoped lang="scss">
  // 定义颜色和字体变量
  $primary-color: #409eff;
  $text-color: #333;
  $border-color: #dcdfe6;
  $background-color: #f5f7fa;

  // 定义边距和尺寸变量
  $padding: 15px;
  $margin: 20px;
  $border-radius: 4px;

  // 注册容器样式
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: $background-color;
  }
  // 注册卡片样式
  .register-card {
    width: 100%;
    max-width: 480px;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background-color: #fff;
  }
  // 卡片标题样式
  .card-title {
    text-align: center;
    margin: 0;
    color: $text-color;
  }
  // 表单样式
  .el-form {
    padding: $padding;
    .el-form-item {
      margin-bottom: $margin;
    }
    .el-button {
      margin-right: $margin;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .register-container {
      .el-form {
        .el-button {
          font-size: 14px; // 在小屏幕上减小按钮字体大小
        }
      }
    }
  }
</style>
