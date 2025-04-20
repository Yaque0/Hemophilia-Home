<template>
  <div class="post-item" @click="goToPostDetail(post.id)">
    <div class="post-main">
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-preview">{{ post.content.slice(0, 100) }}...</p>
      <div class="post-meta">
        <span>
          <el-icon><User /></el-icon>
          {{ post.user?.username }}
        </span>
        <span>
          <el-icon><Timer /></el-icon>
          {{ new Date(post.createdAt).toLocaleDateString() }}
        </span>
        <span>
          <el-icon><View /></el-icon>
          {{ post.views }}
        </span>
        <el-tag size="small" type="info">{{ post.category }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PostData } from "@/types/post";
  import { useRouter } from "vue-router";

  const props = defineProps({
    post: {
      type: Object as () => PostData,
      required: true,
    },
  });

  const router = useRouter();

  const goToPostDetail = (id: number) => {
    router.push(`/post/${id}`);
  };
</script>

<style lang="scss" scoped>
  .post-item {
    background-color: #fff;
    border-radius: 10px;
    margin-top: 20px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
    }

    .post-main {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .post-title {
        font-size: 18px;
        color: #333;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .post-preview {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 10px;
      }

      .post-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #999;

        span {
          display: flex;
          gap: 5px;
          align-items: center;

          el-icon {
            font-size: 16px;
          }

          el-tag {
            font-size: 12px;
            padding: 5px 10px;
            font-weight: 600;
            border-radius: 15px;
            background-color: #f8d7d2;
            color: #333;
          }
        }
      }
    }
  }
</style>
