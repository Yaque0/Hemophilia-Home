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
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 24px;
        color: #333;
        margin: 0;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -15px;
          width: 60px;
          height: 3px;
          background: #f28a8c;
        }
      }
    }

    .el-card {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: none;
      overflow: hidden;
    }

    .news-item {
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:hover {
        background: rgba(242, 138, 140, 0.05);
        transform: translateX(5px);
      }

      .news-link {
        text-decoration: none;
        color: #333;
        display: block;

        h3 {
          font-size: 18px;
          margin-bottom: 10px;
          transition: color 0.3s;
          color: #444;

          &:hover {
            color: #f28a8c;
          }
        }

        .meta {
          display: flex;
          gap: 15px;
          font-size: 14px;
          color: #777;

          span {
            display: flex;
            align-items: center;

            &::before {
              content: "";
              display: inline-block;
              width: 4px;
              height: 4px;
              background: #999;
              border-radius: 50%;
              margin-right: 8px;
            }
          }
        }
      }
    }

    .el-pagination {
      margin-top: 30px;
      justify-content: center;

      :deep(.btn-prev),
      :deep(.btn-next),
      :deep(.number) {
        border-radius: 8px;
        margin: 0 5px;
      }

      :deep(.active) {
        background: #f28a8c;
        color: white;
      }
    }
  }
</style>
