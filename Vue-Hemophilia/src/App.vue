<template>
  <el-container class="layout-container">
    <el-header>
      <!-- 顶部导航 -->
      <NavBar :menu-items="menuItems" :active-menu="route.path" />
    </el-header>

    <el-main>
      <!-- 路由视图，根据导航栏点击动态切换 -->
      <router-view></router-view>
    </el-main>

    <el-footer>
      <div class="footer-content">
        <p>血友病慈善之家 code by yaque</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
  import NavBar from "@/components/NavBar.vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  const menuItems = [
    { label: "首页", path: "/" },
    { label: "论坛", path: "/forum" },
    { label: "商城", path: "/shop" },
  ];
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .layout-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f4f4f9; /* 背景颜色 */
  }

  .el-header {
    background-color: #ffffff; /* 头部背景色 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 头部阴影 */
    padding: 0 40px; /* 左右内边距 */
  }

  .el-main {
    flex: 1;
    padding: 20px 40px; /* 内容区内边距 */
  }

  .el-footer {
    background-color: #ffffff;
    padding: 20px 40px;
    text-align: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    color: #999;
    font-size: 14px;
  }

  .footer-content p {
    margin: 0;
    font-family: "Poppins", sans-serif;
    color: #666;
  }
</style>
