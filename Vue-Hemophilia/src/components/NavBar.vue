<template>
  <div class="nav-bar-box">
    <div class="log">
      <img src="@/assets/logo.png" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <el-menu :default-active="activeMenu" class="nav-menu">
      <el-menu-item
        v-for="(item, index) in menuItems"
        :key="index"
        :index="item.path"
        @click="handleMenuClick(item.path)"
      >
        {{ item.label }}
      </el-menu-item>
    </el-menu>
    <div class="user-actions">
      <template v-if="authStore.token">
        <el-dropdown>
          <span class="user-info">
            {{ authStore.user?.username }}
            <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-button type="primary" @click="goToLogin">登录</el-button>
        <el-button @click="goToRegister">注册</el-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue";
  import { useAuthStore } from "@/stores/auth";
  import { useRouter } from "vue-router";

  // Props
  const props = defineProps({
    title: {
      type: String,
      default: "血友之家",
    },
    menuItems: {
      type: Array as () => Array<{ label: string; path: string }>,
      default: () => [
        { label: "首页", path: "/" },
        { label: "论坛", path: "/forum" },
        { label: "商城", path: "/shop" },
      ],
    },
    activeMenu: {
      type: String,
      default: "/",
    },
  });

  // Router
  const router = useRouter();
  const authStore = useAuthStore();

  const handleLogout = () => {
    authStore.logout();
    router.push("/login");
  };

  const goToLogin = () => {
    router.push("/login");
  };

  const goToRegister = () => {
    router.push("/register");
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
  };
</script>

<style lang="scss" scoped>
  // 温暖的色调
  $primary-color: #f28a8c; // 温暖的粉橙色
  $secondary-color: #f8d7d2; // 柔和的浅粉色
  $hover-color: #ffd9d0; // 菜单项悬浮色
  $active-color: #f28a8c; // 激活项颜色
  $btn-hover-color: #f5b2a3; // 按钮悬浮色
  $shadow-color: rgba(0, 0, 0, 0.1); // 柔和的阴影颜色

  .nav-bar-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 40px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px $shadow-color; // 温和的阴影
    z-index: 10;
    user-select: none;
    position: fixed;
    top: 0;
    width: 100%;
    transition: all 0.3s ease;
    border-bottom: 1px solid #f1f1f1; // 温和的底部边框

    .log {
      display: flex;
      align-items: center;
      font-family: "Poppins", sans-serif;
      font-weight: 600;

      img {
        width: 60px;
        height: 60px;
        margin-right: 12px;
        border-radius: 50%; // 圆形logo
        box-shadow: 0 4px 6px $shadow-color; // 圆形logo的阴影
      }

      span {
        font-size: 22px;
        color: #333;
        font-family: "Poppins", sans-serif;
      }
    }

    .nav-menu {
      display: flex;
      align-items: center;
      flex-grow: 1; // 菜单部分占满剩余空间
      justify-content: center; // 中心对齐

      .el-menu-item {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        padding: 12px 25px;
        border-radius: 8px; // 圆角
        transition: background-color 0.3s ease, color 0.3s ease;
        margin: 0 15px; // 增加左右间距，避免过于拥挤

        &:hover {
          background-color: $hover-color;
          color: $primary-color;
        }

        &.is-active {
          background-color: $primary-color;
          color: white;
          box-shadow: 0 4px 8px $shadow-color; // 激活项的阴影效果
        }
      }
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-left: auto; // 将用户操作区域推到右侧
      font-family: "Poppins", sans-serif;

      .el-button {
        font-size: 14px;
        font-weight: 600;
        padding: 8px 18px;
        border-radius: 25px; // 圆形按钮
        min-width: 120px; // 按钮宽度一致
        white-space: nowrap; // 防止按钮文字被换行

        &.el-button[type="primary"] {
          background-color: $primary-color;
          border-color: $primary-color;
          color: white;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: $btn-hover-color; // 温暖的悬浮色
          }
        }

        .el-button {
          background-color: $secondary-color;
          color: #333;
          border: 1px solid #f0b0a3;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #f4a79a;
          }
        }
      }

      .user-info {
        font-size: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #333;
        transition: color 0.3s ease;

        &:hover {
          color: $primary-color; // 鼠标悬停时改变颜色
        }
      }
    }
  }

  // 响应式调整
  @media (max-width: 768px) {
    .nav-bar-box {
      padding: 10px 20px;
    }

    .log span {
      font-size: 18px;
    }

    .nav-menu {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      margin-top: 10px;
    }

    .el-menu-item {
      width: 100%;
      text-align: left;
      padding: 12px 20px;
      margin: 5px 0; // 增加垂直间距
    }

    .user-actions {
      width: 100%;
      justify-content: space-between;
      margin-top: 15px;
      margin-left: 0;
      gap: 20px; // 增加按钮间的间距，确保按钮不被挤压
    }
  }
</style>
