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
        <el-form-item label="头像" prop="avatar">
          <avatar-uploader
            v-model="registerForm.avatar"
            action="/api/upload/upload-avatar"
            :headers="{ Authorization: `Bearer ${authStore.token}` }"
          />
        </el-form-item>

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
            placeholder="请输入手机号（必填）"
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
          <el-button type="primary" @click="$emit('go-to-login')">
            已有账号？去登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue";
  import { ElMessage, type FormInstance } from "element-plus";
  import { useAuthStore } from "@/stores/authStore";
  import AvatarUploader from "./AvatarUploader.vue";
  import router from "@/router";
  import { RegisterData } from "@/types/auth";

  const registerForm = reactive({
    email: "",
    password: "",
    username: "",
    phone: "",
    avatar: "", // 添加 avatar 字段
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
      { required: true, message: "请输入手机号", trigger: "blur" },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: "请输入正确的手机号",
        trigger: "blur",
      },
    ],
    avatar: [{ required: true, message: "请选择头像", trigger: "blur" }],
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
          // 构造一个符合 RegisterData 类型的对象
          const registerData: RegisterData = {
            email: registerForm.email,
            password: registerForm.password,
            username: registerForm.username,
            phone: registerForm.phone,
            avatar: registerForm.avatar || "", // 上传后的头像 URL
          };
          // 调用注册接口，传递注册数据对象
          await authStore.register(registerData);
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

<style lang="scss" scoped>
  $primary-color: #f28a8c;
  $secondary-color: #409eff;
  $text-color: #606266;

  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

    .register-card {
      width: 480px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);

      .card-title {
        text-align: center;
        color: $primary-color;
        font-size: 24px;
        margin: 0;
      }

      :deep(.el-form-item) {
        margin-bottom: 22px;

        .el-form-item__label {
          color: $text-color;
          font-weight: 500;
        }
      }

      .submit-btn {
        width: 100%;
        background: $primary-color;
        border: none;
        transition: all 0.3s ease;

        &:hover {
          background-color: color.adjust($primary-color, $lightness: -10%);
          transform: translateY(-2px);
        }
      }

      .login-link {
        text-align: center;
        margin-top: 16px;

        a {
          color: $secondary-color;
          text-decoration: none;
          transition: color 0.3s;

          &:hover {
            color: $secondary-color, 15%;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .register-container {
      padding: 20px;

      .register-card {
        width: 100%;
        box-shadow: none;
      }
    }
  }
</style>
