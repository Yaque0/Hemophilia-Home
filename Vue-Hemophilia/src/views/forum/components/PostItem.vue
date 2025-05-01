<template>
  <div class="post-item" @click="goToPostDetail(post.id)">
    <div class="post-main">
      <h3 class="post-title">{{ post.title }}</h3>
      <div class="post-preview" v-html="getPreviewContent(post.content)"></div>
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
  import DOMPurify from "dompurify";
  import { sanitizeHTML } from "@/utils/domUtils";

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

  const getPreviewContent = (content: string) => {
    // 安全处理HTML内容并截取前100个字符
    const sanitized = sanitizeHTML(content);
    return sanitized.slice(0, 100) + (sanitized.length > 100 ? "..." : "");
  };
</script>

<style lang="scss" scoped>
  .post-item {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #e0e0e0;
    }

    .post-main {
      .post-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 12px;
      }

      .post-preview {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 16px;
        :deep(*) {
          margin: 0;
          padding: 0;
          display: inline;
        }
        :deep(br) {
          display: none;
        }
      }

      .post-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 12px;
        color: #999;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .el-tag {
          background-color: #f5f5f5;
          color: #666;
          border: none;
        }
      }
    }
  }
</style>
