<template>
  <div class="news-list">
    <div class="header">
      <h2>新闻列表</h2>
      <el-button
        type="primary"
        @click="goToCreate"
        v-if="authStore.isAuthenticated"
      >
        创建新闻
      </el-button>
    </div>

    <el-card v-loading="loading">
      <template v-if="newsList.length">
        <div v-for="news in newsList" :key="news.id" class="news-item">
          <router-link :to="`/news/${news.id}`" class="news-link">
            <h3>{{ news.title }}</h3>
            <div class="meta">
              <span>作者: {{ news.user.username }}</span>
              <span>浏览: {{ news.views }}</span>
              <span>发布时间: {{ formatDate(news.createdAt) }}</span>
            </div>
          </router-link>
        </div>
      </template>
      <el-empty v-else description="暂无新闻" />

      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetchNews"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/authStore";
  import { getNewsList } from "@/api/news";

  const router = useRouter();
  const authStore = useAuthStore();
  // 定义新闻项类型
  interface NewsItem {
    id: number;
    title: string;
    views: number;
    createdAt: string;
    user: {
      id: number;
      username: string;
    };
  }
  const newsList = ref<NewsItem[]>([]);
  const loading = ref(false);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(0);

  const fetchNews = async () => {
    try {
      loading.value = true;
      const res = await getNewsList({
        page: currentPage.value,
        limit: pageSize.value,
        sort: "newest",
      });
      newsList.value = res.data.news;
      total.value = res.data.total;
    } catch (error) {
      console.error("获取新闻列表失败", error);
    } finally {
      loading.value = false;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const goToCreate = () => {
    router.push("/news/create");
  };

  onMounted(() => {
    fetchNews();
  });
</script>

<style scoped lang="scss">
  .news-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .news-item {
      padding: 20px 0;
      border-bottom: 1px solid #f0f0f0;

      .news-link {
        text-decoration: none;
        color: #333;

        h3 {
          margin-bottom: 10px;
          transition: color 0.3s;

          &:hover {
            color: #f28a8c;
          }
        }

        .meta {
          display: flex;
          gap: 15px;
          font-size: 14px;
          color: #999;

          span {
            display: flex;
            align-items: center;
          }
        }
      }
    }

    .el-pagination {
      margin-top: 30px;
      justify-content: center;
    }
  }
</style>
