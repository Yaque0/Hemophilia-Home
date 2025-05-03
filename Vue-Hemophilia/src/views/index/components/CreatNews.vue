<template>
  <div class="news-create">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入新闻标题" />
      </el-form-item>

      <el-form-item label="封面图片" prop="coverImage">
        <el-upload
          action="/api/upload"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <el-button type="primary">上传封面</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <RichEditor v-model="form.content" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { createNews } from "@/api/news";
  import RichEditor from "@/components/yEditor/RichEditor.vue";
  import { ElMessage } from "element-plus";
  import { ToolbarItem } from "@/components/yEditor/types";

  const router = useRouter();
  const formRef = ref();

  const form = ref({
    title: "",
    coverImage: "",
    content: "",
  });

  const rules = {
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  };

  const handleUploadSuccess = (response: any) => {
    form.value.coverImage = response.url;
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      ElMessage.error("只能上传图片文件");
      return false;
    }
    return true;
  };

  const submit = async () => {
    try {
      await formRef.value.validate();
      await createNews(form.value);
      ElMessage.success("新闻发布成功");
      router.push("/news");
    } catch (error) {
      console.error("发布新闻失败", error);
    }
  };
</script>
<style scoped lang="scss">
  .news-create {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    :deep(.el-form-item__label) {
      font-weight: 600;
      color: #555;
    }

    :deep(.el-input__inner),
    :deep(.el-textarea__inner) {
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      transition: all 0.3s;

      &:focus {
        border-color: #f28a8c;
        box-shadow: 0 0 0 2px rgba(242, 138, 140, 0.2);
      }
    }

    .el-button {
      border-radius: 8px;
      padding: 12px 24px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .el-upload {
      display: block;
      margin-bottom: 10px;
    }
  }
</style>
