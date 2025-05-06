<template>
  <div class="shop-container">
    <el-row :gutter="20">
      <!-- 侧边栏分类筛选 -->
      <el-col :span="4">
        <CategoryFilter
          :categories="['全部', '凝血因子', '止血药物', '护理用品']"
          @select="handleFilter"
        />
      </el-col>

      <!-- 主内容区 -->
      <el-col :span="20">
        <SearchBar @search="handleSearch" />

        <ProductList
          :products="shopStore.products"
          :loading="shopStore.loading"
          @add-to-cart="handleAddToCart"
        />

        <el-pagination
          v-model:current-page="shopStore.pagination.page"
          :page-size="shopStore.pagination.limit"
          :total="shopStore.pagination.total"
          @current-change="shopStore.setPage"
        />
      </el-col>
    </el-row>

    <!-- 购物车侧边栏 -->
    <ShoppingCart :visible="cartVisible" @close="cartVisible = false" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useShopStore } from "@/stores/shopStore";
  import CategoryFilter from "./components/CategoryFillter.vue";
  import ProductList from "./components/ProductList.vue";
  import SearchBar from "./components/SearchBar.vue";
  import ShoppingCart from "./components/ShoppingCart.vue";

  const shopStore = useShopStore();
  const cartVisible = ref(false);

  // 初始化加载商品
  onMounted(() => {
    shopStore.fetchProducts();
  });

  const handleFilter = (category: string) => {
    shopStore.fetchProducts({ category });
  };
  const handleSearch = (keyword: string) => {
    shopStore.fetchProducts({ keyword });
  };

  const handleAddToCart = (productId: number, quantity: number) => {
    shopStore.addItemToCart({ productId, quantity });
    cartVisible.value = true;
  };
</script>

<style scoped lang="scss">
  .shop-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;

    .el-row {
      margin-bottom: 20px;
    }

    .el-pagination {
      margin-top: 20px;
      justify-content: center;
    }
  }
</style>
