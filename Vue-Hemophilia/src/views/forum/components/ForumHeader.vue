<template>
  <div class="forum-header">
    <h2>论坛交流</h2>
    <el-button type="primary" @click="createdPost">发布帖子</el-button>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from "vue-router";

  const router = useRouter();

  const createdPost = () => {
    router.push("/post/create"); // 跳转到创建页
  };
</script>

<style lang="scss" scoped>
  .forum-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: "Poppins", sans-serif;

    h2 {
      font-size: 24px;
      color: #333;
      font-weight: 600;
    }

    .el-button {
      background-color: #f5b2a3;
      color: white;
      font-size: 14px;
      font-weight: 600;
      border-radius: 25px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #f5b2a3;
      }
    }
  }
</style>
