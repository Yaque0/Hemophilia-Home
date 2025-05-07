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
          v-if="cartItem"
          v-model="cartItem.quantity"
          :min="1"
          :max="product.stock"
          @change="handleQuantityChange"
          size="small"
          controls-position="right"
          class="quantity-input"
        />
        <el-button
          v-else
          type="primary"
          :disabled="product.stock === 0"
          @click.stop="addToCart"
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
  import { ref, computed, watch } from "vue";
  import type { ProductData } from "@/types/product";
  import ProductDetail from "@/views/shop/components/ProductDetail.vue";
  import { useShopStore } from "@/stores/shopStore";

  const props = defineProps<{
    product: ProductData;
  }>();
  const shopStore = useShopStore();
  const dialogVisible = ref(false);

  // 获取当前商品在购物车中的信息
  const cartItem = computed(() =>
    shopStore.cartItems.find((item) => item.productId === props.product.id),
  );

  const addToCart = () => {
    shopStore.addItemToCart({
      productId: props.product.id,
      quantity: 1,
    });
  };

  const handleQuantityChange = (val: number) => {
    if (!cartItem.value) return;
    shopStore.updateCartItem(cartItem.value.id, val);
  };
  const handleClose = (done: () => void) => {
    dialogVisible.value = false;
    done();
  };

  const showProductDetail = () => {
    dialogVisible.value = true;
  };
  watch(cartItem, (newVal) => {
    console.log("购物车项变化:", newVal);
    console.log("当前store数据:", shopStore.cartItems);
  });
</script>
<style scoped lang="scss">
  $primary-color: #f28a8c;

  .product-card {
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }

    :deep(.el-card__body) {
      padding: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .el-image {
      width: 100%;
      height: 180px;
      background: #f5f5f5;
    }

    .product-info {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;

      h3 {
        margin: 0 0 8px;
        font-size: 16px;
        color: #333;
        @mixin text-ellipsis($lines: 1) {
          display: -webkit-box;
          -webkit-line-clamp: $lines;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .price {
        font-size: 18px;
        font-weight: bold;
        color: $primary-color;
        margin: 8px 0 12px;
      }

      .el-tag {
        align-self: flex-start;
        margin-bottom: 12px;
      }

      .actions {
        margin-top: auto;
        display: flex;
        justify-content: center;
        align-items: center;

        .el-input-number {
          :deep(.el-input-number__decrease),
          :deep(.el-input-number__increase) {
            background-color: $primary-color;
            color: white;
            border: none;

            &:hover {
              background-color: color.adjust($primary-color, $lightness: -10%);
            }
          }
        }
      }
    }
  }
</style>
