<template>
  <div class="shop-container">
    <!-- 顶部搜索栏 -->
    <div class="search-wrapper">
      <SearchBar @search="handleSearch" />
    </div>

    <el-row :gutter="20" class="main-content">
      <!-- 侧边栏分类筛选 -->
      <el-col :span="4" class="category-col">
        <CategoryFilter
          :categories="['全部', '凝血因子', '止血药物', '护理用品']"
          @select="handleFilter"
        />
      </el-col>

      <!-- 主内容区 -->
      <el-col :span="20" class="product-col">
        <ProductList
          :products="shopStore.products"
          :total="shopStore.pagination.total"
          :loading="shopStore.loading"
          @add-to-cart="handleAddToCart"
          @open-cart="cartVisible = true"
        />

        <el-pagination
          v-model:current-page="shopStore.pagination.page"
          :page-size="shopStore.pagination.limit"
          :total="shopStore.pagination.total"
          @current-change="handlePageChange"
          :disabled="shopStore.loading"
          :pager-count="5"
          background
          class="pagination"
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
  import type { ProductData } from "@/types/product";
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

  const handleAddToCart = (product: ProductData) => {
    shopStore.addItemToCart({
      productId: product.id,
      quantity: 1,
    });
    cartVisible.value = true;
  };
  const handlePageChange = (page: number) => {
    shopStore.setPage(page);
    shopStore.fetchProducts();
  };
</script>
<style scoped lang="scss">
  $primary-color: #f28a8c;

  .shop-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: calc(100vh - 120px);

    .search-wrapper {
      margin-bottom: 24px;
      padding: 0 12px;
    }

    .main-content {
      margin: 0 !important;
    }

    .category-col {
      padding-right: 20px !important;
      position: sticky;
      top: 20px;
      height: fit-content;
    }

    .product-col {
      padding-left: 20px !important;
    }

    .pagination {
      margin-top: 32px;
      justify-content: center;
    }
  }
</style>
