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
      <el-button
        type="primary"
        size="large"
        @click="handleCheckout"
        :loading="checkoutLoading"
        >结算</el-button
      >
    </div>
    <QrCode
      ref="qrcodeRef"
      :ws-url="wsServerUrl"
      :initial-url="initialQrUrl"
      :usage-type="'payment'"
      @success="handlePaymentSuccess"
    />
  </el-drawer>
</template>

<script setup lang="ts">
  import { useShopStore } from "@/stores/shopStore";
  import { ElMessage } from "element-plus";
  import { computed, nextTick, ref } from "vue";
  import QrCode from "./QrCode.vue"; // 引入 QrCode 组件
  const shopStore = useShopStore();
  const props = defineProps<{
    visible: boolean;
  }>();
  const qrcodeRef = ref<InstanceType<typeof QrCode>>(); // 组件实例类型
  const emit = defineEmits(["close"]);

  const visible = computed({
    get: () => props.visible,
    set: (val) => !val && emit("close"),
  });
  // 动态生成WebSocket地址
  const wsServerUrl = computed(() => {
    return `ws://localhost:3000/ws?type=payment`;
  });
  // 初始二维码URL，含总价
  const initialQrUrl = computed(() => {
    return `${window.location.origin}/payment?amount=${shopStore.cartTotalPrice}`;
  });
  const handlePaymentSuccess = (data: any) => {
    ElMessage.success(`支付成功，金额: ¥${data.amount}`);
    shopStore.clearCart();

    visible.value = false;
  };
  const checkoutLoading = ref(false);

  const handleCheckout = () => {
    if (!qrcodeRef.value) {
      return ElMessage.error("支付组件初始化失败");
    }
    checkoutLoading.value = true;
    nextTick(() => {
      try {
        qrcodeRef.value?.open();
      } catch (e) {
        console.error("支付弹窗打开失败:", e);
        ElMessage.error("支付系统初始化失败");
      }
    });
    setTimeout(() => (checkoutLoading.value = false), 500);
  };
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
