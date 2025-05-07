<template>
  <div class="cart-icon" @click="handleCartClick">
    <el-badge
      :value="totalCount"
      :max="99"
      class="item"
      :hidden="totalCount === 0"
    >
      <el-icon :size="24"><ShoppingCart /></el-icon>
    </el-badge>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  import { ShoppingCart } from "@element-plus/icons-vue";
  import { useShopStore } from "@/stores/shopStore";

  const shopStore = useShopStore();
  const totalCount = ref(0);
  const emit = defineEmits(["open-cart"]);

  // 从 store 获取购物车数量
  const updateCartCount = () => {
    console.log("当前购物车数据:", shopStore.cartItems);
    console.log("store中的cartTotalItems:", shopStore.cartTotalItems);
    totalCount.value = shopStore.cartTotalItems;
    console.log("计算后的总数:", totalCount.value);
  };

  // 初始化获取购物车数量
  onMounted(() => {
    shopStore.fetchCartItems().then(() => {
      updateCartCount();
    });
  });

  // 监听购物车变化
  watch(
    () => shopStore.cartItems,
    () => {
      updateCartCount();
    },
    { deep: true, immediate: true },
  );

  const handleCartClick = () => {
    emit("open-cart");
  };
</script>
<style scoped lang="scss">
  $primary-color: #f28a8c;
  .cart-icon {
    position: fixed;
    right: 40px;
    bottom: 40px;
    z-index: 1000;
    cursor: pointer;
    background: #fff;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1) translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      background: $primary-color;

      .el-icon {
        color: #fff;
      }
    }

    .el-icon {
      color: $primary-color;
      font-size: 24px;
      transition: all 0.3s ease;
    }

    .item {
      :deep(.el-badge__content) {
        background-color: $primary-color;
        color: #fff;
        border: none;
        font-weight: bold;
      }
    }
  }
</style>
