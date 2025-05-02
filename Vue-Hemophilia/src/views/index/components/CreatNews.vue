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
