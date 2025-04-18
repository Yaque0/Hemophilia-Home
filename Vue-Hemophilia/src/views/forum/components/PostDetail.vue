<template>
  <div v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>

    <!-- 帖子正文（富文本内容） -->
    <div v-html="post.content" class="post-content"></div>

    <!-- 元信息 -->
    <div class="post-meta">
      <span>
        <el-icon><User /></el-icon>
        {{ post.user?.username }}
      </span>
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

      <!-- 评论输入框 -->
      <CommentForm :postId="postId" @success="fetchComments" />

      <CommentList
        v-if="comments.length"
        :comments="comments"
        :post-id="postId"
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
  import { getPostDetail, PostData } from "@/api/post";
  import { getPostComments, FullComment } from "@/api/conmment";
  import dayjs from "dayjs";
  import CommentList from "./CommentList.vue";
  import CommentForm from "./CommentForm.vue"; // 引入 CommentForm 组件

  const route = useRoute();
  const post = ref<PostData | null>(null);
  const comments = ref<FullComment[]>([]);

  // ✅ 显式将 route 中的 id 转为 number 类型
  const postId = computed(() => Number(route.params.id));

  const fetchPostDetail = async () => {
    try {
      const res = await getPostDetail(postId.value);
      post.value = res.data.post;
      await fetchComments(); // 加载评论
    } catch (error) {
      console.error("获取帖子详情失败", error);
    }
  };

  const fetchComments = async () => {
    try {
      console.log("请求评论，postId:", postId.value);
      const res = await getPostComments(postId.value);

      console.log("返回结果：", res.data);
      comments.value = res.data.comments; // 修改为 comments
    } catch (error) {
      console.error("获取评论失败", error);
    }
  };

  onMounted(() => {
    fetchPostDetail();
  });
</script>

<style scoped>
  .post-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .post-meta {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: #999;
  }

  .comment {
    margin-top: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
  }

  .post-content {
    margin: 20px 0;
    line-height: 1.6;
  }

  .comments-section {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }

  .comment p {
    margin: 0;
    font-size: 14px;
  }
</style>
