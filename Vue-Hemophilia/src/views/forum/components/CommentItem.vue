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

    <button
      v-if="shouldShowMoreButton"
      @click="loadDeeper"
      :disabled="loading"
      class="load-more-btn"
    >
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

<style lang="scss" scoped>
  .comment {
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-left: 3px solid #e0e0e0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      border-left-color: #409eff;
    }

    .comment-content {
      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 0.75rem;
          object-fit: cover;
          border: 2px solid #f5f5f5;
        }

        .username {
          font-weight: 600;
          color: #333;
        }
      }

      p {
        margin: 0 0 0.75rem 0;
        font-size: 0.95rem;
        line-height: 1.6;
        color: #444;
      }

      .time {
        font-size: 0.75rem;
        color: #888;
        display: block;
        margin-top: 0.5rem;
      }

      button {
        margin-top: 0.75rem;
        padding: 0.5rem 1rem;
        background-color: #f5f5f5;
        border: none;
        border-radius: 4px;
        color: #666;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background-color: #e0e0e0;
          color: #333;
        }
      }
    }

    .reply-form {
      margin-top: 1rem;

      textarea {
        width: 100%;
        min-height: 80px;
        padding: 0.75rem;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 0.9rem;
        resize: vertical;
        transition: border-color 0.2s ease;

        &:focus {
          outline: none;
          border-color: #409eff;
        }
      }

      button {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #409eff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #3a8ee6;
        }
      }
    }

    .replies {
      margin-top: 1rem;
      padding-left: 1.5rem;
      border-left: 2px solid #f0f0f0;
    }
  }

  .comment-enter-active,
  .comment-leave-active {
    transition: all 0.3s ease;
  }

  .comment-enter-from,
  .comment-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }
  .load-more-btn {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    margin-top: 0.75rem;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    color: #495057;
    font-size: 0.85rem;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: #e9ecef;
      border-color: #dee2e6;
      color: #212529;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
    }
  }
</style>
