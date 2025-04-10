<template>
  <div class="form-container">
    <ForumHeader />
    <CategoryFilter v-model:category="queryParams.category" />
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
  import { getPosts, PostData } from "@/api/post";
  import ForumHeader from "./components/ForumHeader.vue";
  import CategoryFilter from "./components/CategoryFilter.vue";
  import PostItem from "./components/PostItem.vue";
  import Pagination from "./components/Pagination.vue";

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
      const res = await getPosts(queryParams.value);
      posts.value = res.data.posts;
      total.value = res.data.total;
    } finally {
      loading.value = false;
    }
  };
  const handlePageChange = (page: number) => {
    queryParams.value.page = page;
    fetchPosts();
  };
  onMounted(() => {
    fetchPosts();
  });
</script>
