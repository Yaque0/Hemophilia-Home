<template>
  <div class="hot-news">
    <h3>热点新闻</h3>
    <ul>
      <li v-for="news in newsList" :key="news.id">
        <a :href="news.link" target="_blank">{{ news.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue";
  const newsList = ref([
    { id: 1, title: "慈善义诊活动上线", link: "#" },
    { id: 2, title: "血友病用药最新指南发布", link: "#" },
    // ...
  ]);
</script>

<style scoped lang="scss">
  .hot-news {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    h3 {
      margin-bottom: 15px;
    }
    li {
      margin: 8px 0;
    }
    a {
      color: #409eff;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
