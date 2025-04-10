<template>
  <el-row :gutter="20">
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
  import ProductCard from "./ProductCard.vue";

  defineProps<{
    products: any[];
  }>();

  const emit = defineEmits(["add-to-cart"]);

  function onAddToCart(product: any) {
    emit("add-to-cart", product);
  }
</script>
