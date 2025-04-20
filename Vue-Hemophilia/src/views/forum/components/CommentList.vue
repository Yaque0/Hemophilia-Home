<template>
  <div>
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <!-- 显示一级评论 -->
      <div class="comment-content">
        <div class="user-info">
          <img
            v-if="comment.user"
            :src="comment.user.avatar"
            alt="avatar"
            class="avatar"
          />
          <span v-if="comment.user" class="username">{{
            comment.user.username
          }}</span>
        </div>
        <p>{{ comment.content }}</p>
      </div>

      <!-- 显示子评论 -->
      <div v-if="comment.replies && comment.replies.length > 0" class="replies">
        <div
          v-for="reply in comment.replies"
          :key="reply.id"
          class="comment reply"
        >
          <div class="comment-content">
            <div class="user-info">
              <img
                v-if="reply.user"
                :src="reply.user.avatar"
                alt="avatar"
                class="avatar"
              />
              <span v-if="reply.user" class="username">{{
                reply.user.username
              }}</span>
            </div>
            <p>{{ reply.content }}</p>
          </div>
        </div>
      </div>

      <!-- 输入框用于发表评论 -->
      <div v-if="isReplying === comment.id" class="reply-input">
        <textarea v-model="replyContent" placeholder="回复此评论..."></textarea>
        <button @click="submitReply(comment.id)">提交回复</button>
      </div>

      <button v-if="!isReplying" @click="startReply(comment.id)">回复</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { createComment } from "@/api/conmment";

  interface User {
    id: number;
    username: string;
    avatar: string;
  }

  interface Comment {
    id: number;
    content: string;
    user: User;
    replies?: Comment[];
    createdAt: string;
  }

  const props = defineProps<{
    comments: Comment[];
    postId: number;
  }>();

  const emit = defineEmits<{
    (e: "reload"): void;
  }>();

  const isReplying = ref<number | null>(null);
  const replyContent = ref("");

  const startReply = (commentId: number) => {
    isReplying.value = commentId;
  };

  const submitReply = async (commentId: number) => {
    if (!replyContent.value.trim()) return;

    await createComment({
      postId: props.postId,
      content: replyContent.value,
      parentId: commentId,
    });

    replyContent.value = "";
    isReplying.value = null;

    emit("reload"); // 通知父组件刷新评论
  };
</script>

<style scoped>
  .comment {
    margin-bottom: 20px;
  }

  .comment .user-info {
    display: flex;
    align-items: center;
  }

  .comment .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .comment .username {
    font-weight: bold;
  }

  .replies {
    margin-left: 20px;
  }

  .reply-input {
    margin-top: 10px;
  }

  .reply-input textarea {
    width: 100%;
    height: 80px;
  }

  .reply-input button {
    margin-top: 5px;
  }
</style>
