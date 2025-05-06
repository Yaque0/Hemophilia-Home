<template>
  <el-card class="product-card" @click.stop="showProductDetail">
    <el-image
      lazy
      :src="product.image"
      :scroll-container="'.shop-container'"
      loading="lazy"
      fit="cover"
    />
    <div class="product-info">
      <h3>{{ product.drugName }}</h3>
      <p class="price">¥{{ product.price }}</p>
      <el-tag :type="product.stock > 0 ? 'success' : 'danger'">
        {{ product.stock > 0 ? `库存 ${product.stock}` : "已售罄" }}
      </el-tag>

      <div class="actions">
        <el-input-number
          v-model="quantity"
          :min="1"
          :max="product.stock"
          :disabled="product.stock === 0"
          @click.stop
        />
        <el-button
          type="primary"
          :disabled="product.stock === 0"
          @click.stop="$emit('add-to-cart', product.id, quantity)"
        >
          加入购物车
        </el-button>
      </div>
    </div>

    <!-- 药品详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="药品详情"
      width="50%"
      :modal="true"
      :before-close="handleClose"
      :append-to-body="true"
      custom-class="product-detail-modal"
    >
      <ProductDetail :product="product" />
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import type { ProductData } from "@/types/product";
  import ProductDetail from "@/views/shop/components/ProductDetail.vue";

  const props = defineProps<{
    product: ProductData;
  }>();

  const quantity = ref(1);
  const dialogVisible = ref(false);

  const showProductDetail = () => {
    dialogVisible.value = true;
  };

  const handleClose = (done: () => void) => {
    dialogVisible.value = false;
    done(); // 调用 done 函数关闭弹窗
  };
</script>

<style scoped lang="scss">
  $primary-color: #f28a8c;

  .product-card {
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;

    .el-image {
      width: 100%;
      height: 180px;
    }

    .product-info {
      padding: 16px;

      h3 {
        margin: 0 0 8px;
        font-size: 16px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .price {
        font-size: 18px;
        font-weight: bold;
        color: $primary-color;
        margin: 8px 0;
      }

      .actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        align-items: center;

        .el-button {
          flex: 1;
        }
      }
    }
  }
  :deep(.product-detail-modal) {
    .el-dialog {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .el-dialog__header {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .el-dialog__body {
      padding: 16px;
    }
  }
</style>
