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
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    height: 100%;

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
