<template>
  <div class="comment" :style="`margin-left: ${depth * 20}px`">
    <div class="comment-content">
      <div class="user-info">
        <img :src="comment.user.avatar" class="avatar" />
        <span class="username">{{ comment.user.username }}</span>
      </div>
      <p>{{ comment.content }}</p>
      <span class="time">{{
        dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")
      }}</span>

      <button @click="isReplying = !isReplying">回复</button>
    </div>

    <!-- 回复表单 -->
    <div v-if="isReplying" class="reply-form">
      <textarea v-model="replyContent"></textarea>
      <button @click="submitReply">提交</button>
    </div>

    <!-- 递归渲染子评论 -->
    <div v-if="replies.length" class="replies">
      <CommentItem
        v-for="reply in replies"
        :key="reply.id"
        :comment="reply"
        :postId="postId"
        :depth="depth + 1"
        @reload="emit('reload')"
      />
    </div>

    <button v-if="shouldShowMoreButton" @click="loadDeeper" :disabled="loading">
      {{ loading ? "加载中..." : "展开更多回复" }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import {
    createComment,
    getDeepComments,
    getPostComments,
  } from "@/api/comment";
  import dayjs from "dayjs";
  import type { FullComment } from "@/types/comment";
  const props = defineProps<{
    comment: FullComment;
    postId: number;
    depth: number;
  }>();

  const emit = defineEmits(["reload"]);
  const replies = ref<FullComment[]>(props.comment.replies || []);
  const loading = ref(false);
  const hasMore = ref(true);
  const isReplying = ref(false);
  const replyContent = ref("");
  const loadDeeper = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;
    try {
      const res = await getDeepComments(props.comment.id, {
        page: Math.floor(replies.value.length / 3) + 1, // 每次加载3条
        limit: 3,
      });

      if (res.data.comments.length) {
        // 只添加新加载的评论，而不是替换全部
        replies.value = [...replies.value, ...res.data.comments];
        hasMore.value = res.data.hasMore;
      }
    } finally {
      loading.value = false;
    }
  };
  const shouldShowMoreButton = computed(() => {
    return props.depth < 3 && hasMore.value && replies.value.length >= 3;
  });
  const submitReply = async () => {
    if (!replyContent.value.trim()) return;

    await createComment({
      postId: props.postId,
      content: replyContent.value,
      parentId: props.comment.id,
    });

    // 提交后重新加载子评论
    const res = await getDeepComments(props.comment.id);
    replies.value = res.data.comments;

    emit("reload");
    isReplying.value = false;
    replyContent.value = "";
  };
  onMounted(() => {
    if (props.depth < 3 && !replies.value.length) {
      loadDeeper();
    }
  });
</script>

<style scoped>
  .comment {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-left: 2px solid #eee;
    transition: all 0.3s;
  }

  .comment:hover {
    background-color: #f9f9f9;
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  .time {
    font-size: 0.8rem;
    color: #999;
    display: block;
    margin-top: 0.3rem;
  }

  .reply-form {
    margin-top: 0.5rem;
  }

  .comment {
    transition: all 0.3s ease;
  }

  .comment-enter-active,
  .comment-leave-active {
    transition: all 0.3s;
  }
  .comment-enter-from,
  .comment-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }
</style>
