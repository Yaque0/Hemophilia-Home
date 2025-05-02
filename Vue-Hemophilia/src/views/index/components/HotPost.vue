<template>
  <div class="hot-posts">
    <div class="header">
      <h3>热门帖子</h3>
      <el-button
        v-if="postList.length > 4"
        link
        @click="viewAllPosts"
        type="primary"
        class="more-btn"
      >
        更多
      </el-button>
    </div>
    <ul>
      <li v-for="post in displayedPosts" :key="post.id">
        <router-link :to="`/forum/post/${post.id}`" class="post-link">
          {{ post.title }}
          <span class="views">({{ post.views }}浏览)</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import { getPosts } from "@/api/post";

  const router = useRouter();
  const postList = ref<PostItem[]>([]);

  interface PostItem {
    id: number;
    title: string;
    views: number;
  }

  const displayedPosts = computed(() => {
    return postList.value.slice(0, 4);
  });

  onMounted(async () => {
    try {
      // 添加 sort 参数获取热门帖子
      const res = await getPosts({ sort: "hot", limit: 10 });
      postList.value = res.data.posts;
    } catch (error) {
      console.error("获取热门帖子失败", error);
    }
  });

  const viewAllPosts = () => {
    router.push("/forum");
  };
</script>
<style scoped lang="scss">
  .hot-posts {
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
        background-color: #67c23a;
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
          color: #67c23a;
          margin-right: 10px;
          font-size: 20px;
        }

        &:hover {
          color: #67c23a;
        }
      }
    }
  }
</style>
