<template>
  <el-drawer v-model="visible" title="购物车" size="40%">
    <el-empty
      v-if="shopStore.cartItems.length === 0"
      description="购物车空空如也~"
      image="/empty-cart.svg"
    >
      <el-button type="primary" @click="$router.push('/shop')"
        >去逛逛</el-button
      >
    </el-empty>
    <el-table :data="shopStore.cartItems" v-loading="shopStore.loading">
      <el-table-column prop="product.drugName" label="药品" />
      <el-table-column prop="product.price" label="单价" width="100">
        <template #default="{ row }"> ¥{{ row.product.price }} </template>
      </el-table-column>
      <el-table-column label="数量" width="120">
        <template #default="{ row }">
          <el-input-number
            v-model="row.quantity"
            :min="1"
            @change="shopStore.updateCartItem(row.id, row.quantity)"
          />
        </template>
      </el-table-column>
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
    }

    .el-drawer__body {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: calc(100% - 56px);
    }
  }

  .el-table {
    flex: 1;
    border-top: 1px solid #f0f0f0;

    :deep(.cell) {
      padding: 12px 0;
    }
  }

  .cart-summary {
    padding: 16px;
    border-top: 1px solid #f0f0f0;
    text-align: right;

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
    }
  }
</style>
