<template>
  <div>
    <CommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :postId="postId"
      :depth="0"
      @reload="$emit('reload')"
    />
  </div>
</template>
<script setup lang="ts">
  import CommentItem from "./CommentItem.vue";
  import type { Comment } from "@/types/comment";
  defineProps<{
    comments: Comment[];
    postId: number;
  }>();

  defineEmits(["reload"]);
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
