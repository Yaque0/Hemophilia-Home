<template>
  <div class="news-detail" v-if="news">
    <el-button type="link" @click="goBack" class="back-btn">
      <el-icon><ArrowLeft /></el-icon> 返回
    </el-button>

    <h1>{{ news.title }}</h1>

    <div class="meta">
      <span>作者: {{ news.user.username }}</span>
      <span>发布时间: {{ formatDate(news.createdAt) }}</span>
      <span>浏览: {{ news.views }}</span>
    </div>

    <div v-if="news.coverImage" class="cover">
      <el-image :src="news.coverImage" fit="cover" />
    </div>

    <div class="content" v-html="news.content"></div>

    <div class="actions">
      <el-button type="primary" @click="likeNews" :loading="liking">
        <el-icon><Star /></el-icon> 点赞 ({{ news.likes }})
      </el-button>
    </div>
  </div>

  <el-empty v-else description="新闻不存在" />
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { ArrowLeft, Star } from "@element-plus/icons-vue";
  import { getNewsDetail, likeNews as apiLikeNews } from "@/api/news";

  const route = useRoute();
  const router = useRouter();

  const news = ref<any>(null);
  const liking = ref(false);

  const fetchNewsDetail = async () => {
    try {
      const newsId = Number(route.params.id);
      const res = await getNewsDetail(newsId);
      news.value = res.data.news;
    } catch (error) {
      console.error("获取新闻详情失败", error);
    }
  };

  const likeNews = async () => {
    try {
      liking.value = true;
      // 确保传递的是 number 类型的 ID
      const res = await apiLikeNews(Number(news.value.id));
      news.value.likes = res.data.likes;
    } catch (error) {
      console.error("点赞失败", error);
    } finally {
      liking.value = false;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const goBack = () => {
    router.go(-1);
  };

  onMounted(() => {
    fetchNewsDetail();
  });
</script>

<style scoped lang="scss">
  .news-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;

    .back-btn {
      margin-bottom: 20px;
    }

    h1 {
      font-size: 28px;
      margin-bottom: 20px;
    }

    .meta {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      color: #666;
      font-size: 14px;
    }

    .cover {
      margin-bottom: 30px;
      border-radius: 8px;
      overflow: hidden;

      :deep(.el-image) {
        width: 100%;
        max-height: 400px;
      }
    }

    .content {
      line-height: 1.8;
      margin-bottom: 30px;
    }

    .actions {
      margin-top: 30px;
    }
  }
</style>
