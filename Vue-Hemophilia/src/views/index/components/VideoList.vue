<template>
  <div class="video-list">
    <h3>推荐视频</h3>
    <el-row :gutter="20">
      <el-col :span="8" v-for="video in videos" :key="video.id">
        <div class="video-card">
          <img :src="video.cover" alt="video" />
          <p>{{ video.title }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue";

  const videos = ref([
    { id: 1, title: "血友病科普讲座", cover: "#" },
    { id: 2, title: "日常护理方法", cover: "#" },
    { id: 3, title: "公益故事分享", cover: "#" },
  ]);
</script>

<style scoped lang="scss">
  .video-list {
    h3 {
      margin-bottom: 20px;
    }

    .video-card {
      background-color: #fff;
      border-radius: 12px;
      padding: 10px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
      }

      p {
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
</style>
