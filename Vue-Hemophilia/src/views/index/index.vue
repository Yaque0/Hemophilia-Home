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
    padding: 30px;
    max-width: 1400px;
    margin: 0 auto;
    background-color: #f8f9fa;

    .top-section {
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 25px;
      margin-bottom: 50px;

      .side-panel {
        flex: 1;
        background-color: #fff;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
        }
      }

      .carousel-panel {
        flex: 1.5;
        background-color: #fff;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.01);
        }
      }
    }

    .video-section {
      background-color: #fff;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }
    }
  }

  @media (max-width: 992px) {
    .home-page {
      padding: 20px;

      .top-section {
        flex-direction: column;
        gap: 20px;
      }
    }
  }
</style>
