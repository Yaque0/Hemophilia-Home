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
    max-width: 700px; // 设置最大宽度为 600px
    margin: 0 auto;
    padding: 20px; // 增加内边距，确保有一定的留白
    position: relative;
    background-color: #f4f0e6; // 温暖的浅米色背景
    border-radius: 15px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); // 更柔和的阴影
    overflow: hidden;
  }

  .carousel-slide {
    width: 100%;
    height: 100%;
    background-size: cover; // 保证图片填充整个容器
    background-position: center; // 保证图片居中显示
    background-repeat: no-repeat; // 防止图片重复
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    transition: all 0.5s ease;
    padding: 10px; // 让图片四周有一定留白
    box-sizing: border-box;

    &:hover {
      transform: scale(1.05); // 在 hover 时略微放大图片
      filter: brightness(1.1); // 增加亮度，提升温暖感
    }
  }

  .carousel-info {
    background: rgba(255, 255, 255, 0.7); // 使用更浅的背景色，增加温暖感
    color: #333;
    padding: 20px;
    text-align: center;
    width: 80%;
    margin: 0 auto;
    border-radius: 12px;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); // 添加轻微阴影，增加层次感

    h2 {
      font-size: 22px; // 调整字体大小以适应 600px 宽度
      margin-bottom: 12px;
      font-weight: 700;
      line-height: 1.4;
      color: #3b3b3b;
    }

    a {
      color: #fff;
      text-decoration: none;
      font-size: 16px; // 调整按钮字体大小
      font-weight: 600;
      border: 2px solid #fff;
      padding: 10px 20px;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0.4);
      transition: background-color 0.3s ease, transform 0.3s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.6); // 更柔和的hover效果
        transform: scale(1.05);
      }
    }
  }

  .el-carousel {
    border-radius: 15px;
    overflow: hidden;
  }

  .el-carousel .el-carousel-item {
    transition: transform 0.5s ease-in-out;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .carousel-container {
      padding: 15px;
    }

    .carousel-info h2 {
      font-size: 20px; // 在较小设备上调整标题的字体大小
    }

    .carousel-info a {
      font-size: 14px; // 在较小设备上调整按钮的字体大小
    }
  }
</style>
