<template>
  <div class="shop-page">
    <SearchBar @search="handleSearch" />
    <CategoryFilter :categories="categories" @select="handleCategorySelect" />
    <ProductList :products="filteredProducts" @add-to-cart="addToCart" />
    <ShoppingCar :item-count="cart.length" @click="goToCart" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import SearchBar from "./components/SearchBar.vue";
  import CategoryFilter from "./components/CategoryFillter.vue";
  import ProductList from "./components/ProductList.vue";
  import ShoppingCar from "./components/ShoppingCart.vue";

  const products = ref([
    {
      id: 1,
      name: "阿司匹林",
      description: "缓解疼痛",
      price: 18.5,
      category: "药品",
      image: "/images/aspirin.jpg",
    },
    {
      id: 2,
      name: "轮椅",
      description: "舒适便捷",
      price: 350,
      category: "医疗器械",
      image: "/images/wheelchair.jpg",
    },
    // ...其他商品
  ]);

  const cart = ref<any[]>([]);
  const searchTerm = ref("");
  const selectedCategory = ref("");

  const categories = ["全部", "药品", "医疗器械"];

  const filteredProducts = computed(() => {
    return products.value.filter((p) => {
      const matchesSearch = p.name.includes(searchTerm.value);
      const matchesCategory =
        selectedCategory.value === "全部" ||
        !selectedCategory.value ||
        p.category === selectedCategory.value;
      return matchesSearch && matchesCategory;
    });
  });

  function handleSearch(val: string) {
    searchTerm.value = val;
  }

  function handleCategorySelect(category: string) {
    selectedCategory.value = category;
  }

  function addToCart(product: any) {
    cart.value.push(product);
  }

  function goToCart() {
    // 跳转到购物车页
  }
</script>

<style scoped lang="scss">
  .shop-page {
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
