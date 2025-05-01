<template>
  <div class="carousel-container">
    <el-carousel :interval="5000" arrow="always" class="carousel">
      <el-carousel-item v-for="(item, index) in carouselList" :key="item.id">
        <div
          class="carousel-slide"
          :style="{ backgroundImage: 'url(' + item.image + ')' }"
        >
          <div class="carousel-info">
            <h2>{{ item.title }}</h2>
            <a :href="item.link" target="_blank">查看详情</a>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import { Carousel, getCarouselList } from "@/api/carousel";

  const carouselList = ref<Carousel[]>([]);

  onMounted(async () => {
    try {
      const res = await getCarouselList(); // 调用获取轮播图数据的接口
      console.log("获取到的轮播图数据:", res); // 打印整个响应数据

      if (res && res.data && res.data.carousel) {
        // 确保 `res.data.carousel` 是一个数组
        carouselList.value = res.data.carousel;
      } else {
        console.error("轮播图数据格式不正确:", res);
      }
    } catch (error) {
      console.error("获取轮播图数据失败:", error);
    }
  });
</script>
<style scoped lang="scss">
  .carousel-container {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    .carousel-slide {
      width: 100%;
      height: 100%;
      min-height: 400px;
      background-size: cover;
      background-position: center;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.7) 0%,
          rgba(0, 0, 0, 0) 50%
        );
      }
    }

    .carousel-info {
      position: relative;
      z-index: 2;
      padding: 30px;
      width: 100%;
      max-width: 800px;
      text-align: center;

      h2 {
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 20px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      a {
        display: inline-block;
        padding: 12px 30px;
        background-color: rgba(255, 255, 255, 0.9);
        color: #f28a8c;
        text-decoration: none;
        border-radius: 30px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        &:hover {
          background-color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
      }
    }

    :deep(.el-carousel__arrow) {
      background-color: rgba(255, 255, 255, 0.3);
      color: #fff;
      font-size: 20px;
      width: 50px;
      height: 50px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }

    :deep(.el-carousel__indicators) {
      bottom: 20px;

      .el-carousel__indicator {
        padding: 10px 5px;

        .el-carousel__button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        &.is-active .el-carousel__button {
          background-color: #fff;
          width: 20px;
          border-radius: 5px;
        }
      }
    }
  }
</style>
