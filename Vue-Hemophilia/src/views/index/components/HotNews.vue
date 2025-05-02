<template>
  <div class="hot-news">
    <div class="header">
      <h3>热点新闻</h3>
      <el-button
        v-if="newsList.length >= 4"
        type="primary"
        link
        @click="viewAllNews"
        class="more-btn"
      >
        更多
      </el-button>
    </div>
    <ul>
      <li v-for="news in displayedNews" :key="news.id">
        <router-link :to="`/news/${news.id}`" class="news-link">
          {{ news.title }}
          <span class="views">({{ news.views }}浏览)</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { getHotNews } from "@/api/news";

  const router = useRouter();
  const newsList = ref<NewsItem[]>([]);

  interface NewsItem {
    id: number;
    title: string;
    views: number;
  }

  const displayedNews = computed(() => {
    return newsList.value.slice(0, 4);
  });

  onMounted(async () => {
    try {
      const res = await getHotNews({ sort: "hot", limit: 10 });
      newsList.value = res.data.news;
    } catch (error) {
      console.error("获取热点新闻失败", error);
    }
  });

  const viewAllNews = () => {
    router.push("/news");
  };
</script>
<style scoped lang="scss">
  .hot-news {
    background-color: #fff;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    height: 100%;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 60px;
        height: 2px;
        background-color: #f28a8c;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 12px 0;
        border-bottom: 1px dashed #eee;
        transition: all 0.3s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          transform: translateX(5px);
        }
      }

      a {
        color: #444;
        text-decoration: none;
        font-size: 15px;
        display: flex;
        align-items: center;
        transition: color 0.3s ease;

        &::before {
          content: "•";
          color: #f28a8c;
          margin-right: 10px;
          font-size: 20px;
        }

        &:hover {
          color: #f28a8c;
        }
      }
    }
  }
</style>
