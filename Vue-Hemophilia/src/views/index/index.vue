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
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    min-height: 100vh;

    .top-section {
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 25px;
      margin-bottom: 50px;

      .side-panel {
        flex: 1;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }
      }

      .carousel-panel {
        flex: 1.5;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
          transform: scale(1.01);
        }
      }
    }

    .video-section {
      background: rgba(255, 255, 255, 0.9);
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:hover {
        transform: translateY(-5px);
      }
    }
  }

  @media (max-width: 992px) {
    .home-page {
      padding: 15px;

      .top-section {
        flex-direction: column;
        gap: 20px;
      }
    }
  }
</style>
