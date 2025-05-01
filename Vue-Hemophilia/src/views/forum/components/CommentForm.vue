<template>
  <div class="comment-form">
    <el-input
      type="textarea"
      v-model="content"
      placeholder="说点什么吧..."
      :rows="3"
    />
    <div class="comment-actions">
      <el-button type="primary" size="small" @click="submitComment"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { createComment } from "@/api/comment";
  import { ElMessage } from "element-plus";

  const props = defineProps<{
    postId: number; // 帖子的 id
    parentId?: number | null; // 如果是子评论，传入父评论的 id，否则为 null，支持 undefined
  }>();

  const emit = defineEmits<{
    (e: "success"): void; // 提交成功后刷新评论列表
  }>();

  const content = ref(""); // 评论内容

  const submitComment = async () => {
    if (!content.value.trim()) return; // 如果评论内容为空，则不提交

    try {
      // 创建评论 API 调用
      await createComment({
        postId: props.postId,
        content: content.value,
        parentId: props.parentId || null, // 传递父评论 id，如果是一级评论则为 null
      });

      content.value = ""; // 清空输入框
      ElMessage.success("评论成功");
      emit("success"); // 触发成功事件，通知父组件刷新评论列表
    } catch (error) {
      ElMessage.error("提交失败，请稍后重试");
    }
  };
</script>

<style lang="scss" scoped>
  .comment-form {
    margin-bottom: 24px;

    .el-textarea {
      :deep(.el-textarea__inner) {
        min-height: 100px;
        padding: 12px;
        border-radius: 8px;
        resize: vertical;
        font-size: 14px;
        line-height: 1.6;
      }
    }

    .comment-actions {
      margin-top: 12px;
      text-align: right;

      .el-button {
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 500;
      }
    }
  }
</style>
