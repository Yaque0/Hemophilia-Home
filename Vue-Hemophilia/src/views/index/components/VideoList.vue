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
    margin: 0;
    padding: 0;

    h3 {
      font-size: 22px;
      font-weight: 600;
      color: #333;
      margin-bottom: 25px;
      position: relative;
      padding-left: 15px;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background-color: #409eff;
        border-radius: 2px;
      }
    }

    .el-row {
      margin: 0 -10px;

      .el-col {
        padding: 0 10px;
        margin-bottom: 20px;
      }
    }

    .video-card {
      background-color: #fff;
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      height: 100%;
      cursor: pointer;
      overflow: hidden;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);

        img {
          transform: scale(1.05);
        }
      }

      img {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-radius: 8px;
        transition: transform 0.5s ease;
        margin-bottom: 15px;
      }

      p {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #444;
        transition: color 0.3s ease;
      }

      &:hover p {
        color: #409eff;
      }
    }
  }
</style>
