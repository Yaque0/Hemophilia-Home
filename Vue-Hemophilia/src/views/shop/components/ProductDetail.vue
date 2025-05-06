<template>
  <div class="product-detail">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-image :src="product.image" fit="contain" />
      </el-col>
      <el-col :span="12">
        <h1>{{ product.drugName }}</h1>
        <p class="price">¥{{ product.price }}</p>
        <p class="stock">库存: {{ product.stock }}</p>
        <p class="description">{{ product.ingredients }}</p>
        <p class="indications">
          <strong>适应症:</strong> {{ product.indications }}
        </p>
        <p class="dosage"><strong>用法用量:</strong> {{ product.dosage }}</p>
        <p class="adverse-reactions">
          <strong>不良反应:</strong> {{ product.adverseReactions }}
        </p>
        <p class="contraindications">
          <strong>禁忌:</strong> {{ product.contraindications }}
        </p>
        <p class="precautions">
          <strong>注意事项:</strong> {{ product.precautions }}
        </p>
        <p class="storage"><strong>贮藏:</strong> {{ product.storage }}</p>
        <p class="specification">
          <strong>规格:</strong> {{ product.specification }}
        </p>
        <p class="manufacturer">
          <strong>生产企业:</strong> {{ product.manufacturer }}
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import type { ProductData } from "@/types/product";

  defineProps<{
    product: ProductData;
  }>();
</script>

<style scoped lang="scss">
  $primary-color: #f28a8c;

  .product-detail {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    h1 {
      font-size: 24px;
      margin: 0 0 16px;
      color: #333;
    }

    .price {
      font-size: 24px;
      font-weight: bold;
      color: $primary-color;
      margin: 16px 0;
    }

    .stock {
      color: #666;
      margin: 8px 0;
    }

    .description {
      color: #555;
      line-height: 1.6;
      margin: 16px 0 24px;
    }
  }
</style>
