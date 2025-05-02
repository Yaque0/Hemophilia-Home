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
      <el-menu-item
        v-if="authStore.token"
        index="/news/create"
        @click="goToCreateNews"
      >
        创建新闻
      </el-menu-item>
    </el-menu>
    <div class="user-actions">
      <template v-if="authStore.token">
        <el-dropdown>
          <span class="user-info">
            <img
              v-if="userStore.user?.avatar"
              :src="userStore.user.avatar"
              alt="Avatar"
              class="user-avatar"
            />
            {{ userStore.user?.username }}
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
  import { useAuthStore } from "@/stores/authStore";
  import { useUserStore } from "@/stores/userStore";
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
  const userStore = useUserStore();
  console.log("====================================");
  console.log(userStore.user);
  console.log("====================================");
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
  const goToCreateNews = () => {
    router.push("/news/create");
  };
</script>

<style lang="scss" scoped>
  .nav-bar-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 40px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    user-select: none;
    position: fixed;
    top: 0;
    width: 100%;
    transition: all 0.3s ease;
    border-bottom: 1px solid #f1f1f1;

    .log {
      display: flex;
      align-items: center;
      font-family: "Poppins", sans-serif;
      font-weight: 600;

      img {
        width: 60px;
        height: 60px;
        margin-right: 12px;
        border-radius: 50%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
      flex-grow: 1;
      justify-content: center;

      .el-menu-item {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        padding: 12px 25px;
        border-radius: 8px;
        transition: background-color 0.3s ease, color 0.3s ease;
        margin: 0 15px;

        &:hover {
          background-color: #ffd9d0;
          color: #f28a8c;
        }

        &.is-active {
          background-color: #f28a8c;
          color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-left: auto;
      font-family: "Poppins", sans-serif;

      .el-button {
        font-size: 14px;
        font-weight: 600;
        padding: 8px 18px;
        border-radius: 25px;
        min-width: 120px;
        white-space: nowrap;

        &.el-button[type="primary"] {
          background-color: #f28a8c;
          border-color: #f28a8c;
          color: white;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #f5b2a3;
          }
        }

        .el-button {
          background-color: #f8d7d2;
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
          color: #f28a8c;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
    }
  }
</style>
