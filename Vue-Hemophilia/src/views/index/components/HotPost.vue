<template>
  <div class="hot-posts">
    <h3>热门帖子</h3>
    <ul>
      <li v-for="post in postList" :key="post.id">
        <a :href="post.link" target="_blank">{{ post.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue";

  const postList = ref([
    { id: 1, title: "求助：用药副作用咨询", link: "#" },
    { id: 2, title: "我和血友病的斗争日记", link: "#" },
    // ...
  ]);
</script>

<style scoped lang="scss">
  .hot-posts {
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
      color: #67c23a;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
