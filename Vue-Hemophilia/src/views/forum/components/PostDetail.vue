<template>
  <div v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>

    <!-- 帖子正文（富文本内容） -->
    <div v-html="post.content" class="post-content"></div>

    <!-- 元信息 -->
    <div class="post-meta">
      <!-- 用户信息 -->
      <div class="user-info">
        <img
          v-if="post.user?.avatar"
          :src="post.user.avatar"
          class="avatar"
          alt="用户头像"
        />
        <span>{{ post.user?.username }}</span>
      </div>

      <span>
        <el-icon><Timer /></el-icon>
        {{ dayjs(post.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
      </span>
      <span>
        <el-icon><View /></el-icon>
        {{ post.views }}
      </span>
      <el-tag size="small" type="info">{{ post.category }}</el-tag>
    </div>

    <!-- 评论区 -->
    <div class="comments-section">
      <h3>评论</h3>

      <CommentForm :postId="postId" @success="fetchComments" />

      <CommentList
        v-if="comments.length"
        :comments="comments"
        :postId="postId"
        @reload="fetchComments"
      />
      <div v-else>暂无评论</div>
    </div>
  </div>

  <div v-else>加载中...</div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  import { getPostDetail } from "@/api/post";
  import type { PostData } from "@/types/post";
  import { getPostComments } from "@/api/comment";
  import type { FullComment } from "@/types/comment"; // 引入 FullComment 类型
  import dayjs from "dayjs";
  import CommentList from "./CommentList.vue";
  import CommentForm from "./CommentForm.vue"; // 引入 CommentForm 组件

  const route = useRoute();
  const post = ref<PostData | null>(null);
  const comments = ref<FullComment[]>([]);
  console.log("====================================");
  console.log("用户名", post.value);
  console.log("====================================");
  // 显式将 route 中的 id 转为 number 类型
  const postId = computed(() => Number(route.params.id));

  const fetchPostDetail = async () => {
    try {
      const res = await getPostDetail(postId.value);
      console.log("API响应数据:", res); // 添加调试日志

      console.log(res.post);

      if (res.post) {
        post.value = res.post;
        await fetchComments();
      } else {
        console.error("返回数据格式不正确:", res);
      }
    } catch (error) {
      console.error("获取帖子详情失败", error);
    }
  };
  const fetchComments = async () => {
    try {
      const res = await getPostComments(postId.value, {
        depth: 3, // 初始加载3层
      });
      comments.value = res.data.comments;
    } catch (error) {
      console.error("获取评论失败", error);
    }
  };

  onMounted(() => {
    fetchPostDetail();
  });
</script>

<style lang="scss" scoped>
  .post-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin-bottom: 24px;
    }

    .post-content {
      font-size: 15px;
      line-height: 1.8;
      color: #444;
      margin-bottom: 32px;

      :deep(p) {
        margin-bottom: 16px;
      }
    }

    .post-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f0f0f0;

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      span {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #888;
      }

      .el-tag {
        background-color: #f5f5f5;
        color: #666;
        border: none;
      }
    }

    .comments-section {
      margin-top: 32px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 20px;
      }
    }
  }
</style>
