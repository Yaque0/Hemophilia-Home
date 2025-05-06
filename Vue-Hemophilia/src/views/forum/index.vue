<template>
  <div class="form-container">
    <ForumHeader />
    <CategoryFilter
      v-model:category="queryParams.category"
      @filter="handleFilter"
    />
    <!-- 使用v-model -->

    <el-card v-loading="loading">
      <template v-if="posts.length">
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
      </template>
      <el-empty v-else description="暂无帖子" />
    </el-card>

    <Pagination
      :currentPage="queryParams.page"
      :limit="queryParams.limit"
      :total="total"
      @update:page="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { getPosts } from "@/api/post";
  import type { PostData } from "@/types/post";
  import ForumHeader from "./components/ForumHeader.vue";
  import CategoryFilter from "./components/CategoryFilter.vue";
  import PostItem from "./components/PostItem.vue";
  import Pagination from "../../components/Pagination.vue";

  const loading = ref(false);
  const posts = ref<PostData[]>([]);
  const total = ref(0);

  const queryParams = ref({
    page: 1,
    limit: 5,
    category: "", // 使用v-model双向绑定category
  });

  const fetchPosts = async () => {
    loading.value = true;
    try {
      const res = await getPosts(queryParams.value); // 确保传入了 queryParams
      posts.value = res.data.posts;
      total.value = res.data.total;
    } finally {
      loading.value = false;
    }
  };
  const handleFilter = (category: string) => {
    queryParams.value.page = 1; // 重置页码
    fetchPosts(); // 重新获取帖子
  };
  const handlePageChange = (page: number) => {
    queryParams.value.page = page;
    fetchPosts();
  };
  onMounted(() => {
    fetchPosts();
  });
</script>
<style lang="scss" scoped>
  .form-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    min-height: calc(100vh - 60px);

    .el-card {
      margin-top: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      border: none;
      overflow: hidden;

      &:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
    }

    .el-empty {
      padding: 60px 0;
      background-color: transparent;

      :deep(.el-empty__description) {
        color: #888;
        font-size: 16px;
      }
    }
  }

  // 新增动画效果
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .post-item-enter-active {
    animation: fadeIn 0.5s ease-out;
  }
</style>
