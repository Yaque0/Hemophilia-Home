<template>
  <el-upload
    class="avatar-uploader"
    :action="action"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :headers="computedHeaders"
    :name="'file'"
  >
    <img v-if="modelValue" :src="modelValue" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup lang="ts">
  import { ElMessage } from "element-plus";
  import { Plus } from "@element-plus/icons-vue";
  import { computed } from "vue";

  const props = defineProps<{
    modelValue: string;
    action?: string; // 上传地址
    headers?: Record<string, string>; // 可选的请求头
  }>();

  const emit = defineEmits(["update:modelValue"]);

  const computedHeaders = computed(() => props.headers ?? {});

  const beforeUpload = (file: File) => {
    const isValid = ["image/jpeg", "image/png"].includes(file.type);
    const isSizeValid = file.size / 1024 / 1024 < 2;
    if (!isValid) ElMessage.error("仅支持 JPG/PNG 格式");
    if (!isSizeValid) ElMessage.error("图片大小不能超过 2MB");
    return isValid && isSizeValid;
  };

  const handleSuccess = (res: any) => {
    console.log("上传成功响应:", res);

    const url = res?.data?.url || res?.url || "";
    if (!url) {
      ElMessage.error("上传成功，但未返回图片地址");
      return;
    }

    emit("update:modelValue", url);
    ElMessage.success("上传成功");
  };
</script>

<style scoped>
  .avatar-uploader-icon {
    width: 120px;
    height: 120px;
    line-height: 120px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    object-fit: cover;
    display: block;
  }
</style>
