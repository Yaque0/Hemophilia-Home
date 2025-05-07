<template>
  <el-row :gutter="20">
    <CartIcon ref="cartIcon" @open-cart="$emit('open-cart')" />
    <el-col
      :xs="24"
      :sm="12"
      :md="8"
      :lg="6"
      v-for="product in products"
      :key="product.id"
    >
      <ProductCard :product="product" @add-to-cart="onAddToCart" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import { nextTick, ref } from "vue";
  import ProductCard from "./ProductCard.vue";
  import CartIcon from "./CartIcon.vue";
  import type { ProductData } from "@/types/product";
  defineProps<{
    products: ProductData[];
    total: number;
    loading?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "add-to-cart", product: ProductData): void;
    (e: "page-change", page: number): void;
    (e: "open-cart"): void;
  }>();

  const currentPage = ref(1);
  const pageSize = 12;
  const cartIcon = ref();
  function onAddToCart(product: ProductData) {
    emit("add-to-cart", product);
    nextTick(() => {
      cartIcon.value?.updateCartCount();
    });
  }

  function handlePageChange(page: number) {
    currentPage.value = page;
    emit("page-change", page);
  }
</script>

<style scoped lang="scss">
  .product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    padding: 16px 0;

    &.loading {
      opacity: 0.6;
      pointer-events: none;
    }
  }
</style>
