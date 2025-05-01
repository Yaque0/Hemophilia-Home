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
