<template>
  <div class="home-page">
    <div class="top-section">
      <!-- 左：热点新闻 -->
      <div class="side-panel">
        <HotNews />
      </div>

      <!-- 中：轮播图 -->
      <div class="carousel-panel">
        <Carousel />
      </div>

      <!-- 右：热点帖子 -->
      <div class="side-panel">
        <HotPost />
      </div>
    </div>

    <!-- 下：视频推荐 -->
    <div class="video-section">
      <VideoList />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Carousel from "./components/Carousel.vue";
  import HotNews from "./components/HotNews.vue";
  import HotPost from "./components/HotPost.vue";
  import VideoList from "./components/VideoList.vue";
</script>

<style lang="scss" scoped>
  .home-page {
    padding: 20px;

    .top-section {
      display: flex;
      justify-content: center;
      align-items: stretch; // 所有子元素等高
      gap: 20px;
      margin-bottom: 40px;

      .side-panel {
        flex: 1;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }

      .carousel-panel {
        flex: 1.5;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
    }

    .video-section {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }
</style>
