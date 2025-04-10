<template>
  <el-card class="product-card" :body-style="{ padding: '16px' }">
    <img :src="product.image" class="product-image" alt="商品图片" />
    <div class="product-info">
      <h4>{{ product.name }}</h4>
      <p class="desc">{{ product.description }}</p>
      <div class="price-cart">
        <span class="price">¥{{ product.price.toFixed(2) }}</span>
        <el-button type="primary" size="small" @click="addToCart"
          >加入购物车</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  defineProps<{
    product: {
      id: number;
      name: string;
      description: string;
      price: number;
      image: string;
    };
  }>();

  const emit = defineEmits(["add-to-cart"]);

  function addToCart() {
    emit("add-to-cart");
  }
</script>

<style scoped lang="scss">
  .product-card {
    width: 100%;
    .product-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .product-info {
      h4 {
        margin: 5px 0;
        font-size: 18px;
      }
      .desc {
        font-size: 14px;
        color: #666;
        margin: 5px 0 10px;
      }

      .price-cart {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
          font-size: 16px;
          color: #f56c6c;
          font-weight: bold;
        }
      }
    }
  }
</style>
