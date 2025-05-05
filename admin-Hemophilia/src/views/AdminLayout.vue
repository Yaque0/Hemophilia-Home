<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="200px">
        <h2>管理后台</h2>
        <el-menu router>
          <el-menu-item index="/">仪表盘</el-menu-item>
          <el-menu-item index="/users">用户管理</el-menu-item>
          <el-menu-item index="/content">内容审核</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// 基础布局逻辑
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}
</style>
