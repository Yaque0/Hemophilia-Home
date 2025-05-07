<template>
  <el-drawer v-model="visible" title="购物车" size="40%">
    <el-empty
      v-if="shopStore.cartItems.length === 0"
      description="购物车空空如也~"
    >
      <el-button type="primary" @click="$router.push('/shop')"
        >去逛逛</el-button
      >
    </el-empty>
    <el-table :data="shopStore.cartItems" v-loading="shopStore.loading">
      <!-- 药品图片列 -->
      <el-table-column label="图片" width="100">
        <template #default="{ row }">
          <el-image
            :src="row.product?.image"
            fit="cover"
            style="width: 60px; height: 60px"
          />
        </template>
      </el-table-column>

      <!-- 药品名称列 -->
      <el-table-column prop="product.drugName" label="药品名称" width="150" />

      <!-- 药品价格列 -->
      <el-table-column label="单价" width="100">
        <template #default="{ row }">
          ¥{{ (Number(row.product?.price) || 0).toFixed(2) }}
        </template>
      </el-table-column>

      <!-- 数量列 -->
      <el-table-column label="数量" width="120">
        <template #default="{ row }">
          <el-input-number
            v-model="row.quantity"
            :min="1"
            :max="row.product?.stock || 999"
            @change="shopStore.updateCartItem(row.id, row.quantity)"
            controls-position="right"
            size="small"
            style="width: 110px"
          />
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="80">
        <template #default="{ row }">
          <el-button
            type="danger"
            size="small"
            @click="shopStore.removeCartItem(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="cart-summary">
      <p>共 {{ shopStore.cartTotalItems }} 件商品</p>
      <p class="total-price">总计: ¥{{ shopStore.cartTotalPrice }}</p>
      <el-button type="primary" size="large">结算</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
  import { useShopStore } from "@/stores/shopStore";
  import { computed } from "vue";

  const shopStore = useShopStore();
  const props = defineProps<{
    visible: boolean;
  }>();

  const emit = defineEmits(["close"]);

  const visible = computed({
    get: () => props.visible,
    set: (val) => !val && emit("close"),
  });
</script>

<style scoped lang="scss">
  $primary-color: #f28a8c;

  :deep(.el-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
      font-weight: 600;
    }

    .el-drawer__body {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: calc(100% - 57px);
    }
  }

  .el-table {
    flex: 1;
    border-top: 1px solid #f0f0f0;

    :deep(.cell) {
      padding: 12px 0;
      font-size: 14px;
    }

    :deep(th .cell) {
      font-weight: 500;
      color: #666;
    }
  }

  .cart-summary {
    padding: 16px 20px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;

    p {
      margin: 8px 0;
      color: #666;
    }

    .total-price {
      font-size: 18px;
      font-weight: bold;
      color: $primary-color;
    }

    .el-button {
      margin-top: 16px;
      width: 100%;
      height: 48px;
      font-size: 16px;
      border-radius: 4px;
    }
  }
</style>
