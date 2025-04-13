<template>
  <div class="post-create">
    <el-form ref="formRef" :model="form" label-width="80px">
      <!-- 标题 -->
      <el-form-item
        label="标题"
        prop="title"
        :rules="[{ required: true, message: '请输入标题' }]"
      >
        <el-input v-model="form.title" placeholder="请输入帖子标题" />
      </el-form-item>

      <!-- 分类 -->
      <el-form-item
        label="分类"
        prop="category"
        :rules="[{ required: true, message: '请选择分类' }]"
      >
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option
            v-for="c in categories"
            :key="c.value"
            :label="c.label"
            :value="c.value"
          />
        </el-select>
      </el-form-item>

      <!-- 富文本编辑器 -->
      <el-form-item
        label="内容"
        prop="content"
        :rules="[{ required: true, message: '请输入内容' }]"
      >
        <RichEditor
          v-model="form.content"
          :sanitize-config="{
            ALLOWED_TAGS: ['p', 'b', 'img', 'a'],
            ALLOWED_ATTR: ['href', 'src', 'alt'],
          }"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">立即发布</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { ElMessage } from "element-plus";
  import { createPost } from "@/api/post";
  import RichEditor from "@/components/yEditor/RichEditor.vue";

  // 分类选项
  const categories = [
    { label: "护理知识", value: "tech" },
    { label: "用药经验", value: "feedback" },
    { label: "生活分享", value: "announcement" },
    { label: "求助咨询", value: "help" },
  ];

  const router = useRouter();
  const form = ref({
    title: "",
    category: "",
    content: "",
  });

  // 提交表单
  const submitForm = async () => {
    try {
      // 调用创建接口
      await createPost({
        title: form.value.title,
        content: form.value.content,
        category: form.value.category,
        id: 0,
        user: {
          id: 0,
          username: "",
          avatar: "",
        },
        views: 0,
        createdAt: new Date(),
      });

      ElMessage.success("帖子发布成功！");
      router.push("/"); // 跳转到首页
    } catch (error) {
      ElMessage.error("发布失败，请稍后重试");
      console.error("发帖错误:", error);
    }
  };

  // 取消发布
  const cancel = () => {
    router.go(-1);
  };
</script>

<style lang="scss" scoped>
  .post-create {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;

    .el-form {
      width: 100%;
    }

    .el-form-item {
      margin-bottom: 1rem;
    }

    .el-form-item label {
      font-weight: 600;
      color: #333;
    }

    .el-input,
    .el-select {
      border-radius: 6px;
      box-shadow: none;
      background-color: #f7f7f7;
      padding: 0.6rem 1rem;
      font-size: 1rem;
      border: 1px solid #dcdfe6;
      transition: all 0.3s ease;

      &:focus {
        border-color: #409eff;
        box-shadow: 0 0 5px rgba(64, 158, 255, 0.3);
      }
    }

    .el-button {
      width: 120px;
      padding: 0.8rem;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.3s ease;

      &.el-button--primary {
        background-color: #409eff;
        color: #fff;
        border: none;
      }

      &:hover {
        background-color: #3a8ee6;
        cursor: pointer;
      }

      & + .el-button {
        margin-left: 15px;
        background-color: #f4f5f7;
        border: 1px solid #dcdfe6;
      }

      & + .el-button:hover {
        background-color: #e2e3e8;
      }
    }

    .el-select {
      background-color: #fff;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
    }

    .el-form-item .el-input__inner {
      background-color: #f7f7f7;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border: 1px solid #dcdfe6;
      transition: all 0.3s ease;
    }

    .el-form-item .el-input__inner:focus {
      border-color: #409eff;
      box-shadow: 0 0 5px rgba(64, 158, 255, 0.3);
    }

    /* 富文本编辑器区域样式 */
    .rich-editor {
      width: 100%; /* 设置宽度为100%，使其占满父容器 */
      padding: 10px;
      background: #fafafa;
      border-radius: 8px;
      border: 1px solid #dcdfe6;
      min-height: 200px;
      max-height: 400px;
      overflow-y: auto;
    }

    .rich-editor .toolbar {
      margin-bottom: 1rem;
    }

    /* 动态提示与表单项 */
    .el-form-item__error {
      color: #f56c6c;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
  }
</style>
