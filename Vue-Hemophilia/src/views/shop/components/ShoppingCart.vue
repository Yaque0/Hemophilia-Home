<template>
  <div class="cart-page">
    <h2 class="page-title">购物车</h2>

    <el-table :data="cartItems" border class="cart-table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品信息" min-width="300">
        <template #default="{ row }">
          <div class="product-info">
            <img :src="row.image" alt="商品图" class="product-image" />
            <div class="product-details">
              <div class="product-name">{{ row.name }}</div>
              <div class="product-type">{{ row.type }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="单价" width="100">
        <template #default="{ row }"> ￥{{ row.price.toFixed(2) }} </template>
      </el-table-column>

      <el-table-column label="数量" width="150">
        <template #default="{ row }">
          <el-input-number v-model="row.quantity" :min="1" :max="999" />
        </template>
      </el-table-column>

      <el-table-column label="小计" width="100">
        <template #default="{ row }">
          ￥{{ (row.price * row.quantity).toFixed(2) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template #default="{ $index }">
          <el-button type="danger" size="small" @click="removeItem($index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 结算区 -->
    <div class="checkout-bar">
      <div class="total">
        总计：<span class="price">￥{{ totalPrice }}</span>
      </div>
      <el-button type="primary" size="large" @click="checkout"
        >去结算</el-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ElMessage } from "element-plus";
  import { ref, computed } from "vue";

  interface CartItem {
    name: string;
    type: string;
    image: string;
    price: number;
    quantity: number;
  }

  const cartItems = ref<CartItem[]>([
    {
      name: "阿司匹林",
      type: "处方药",
      image: "/images/aspirin.jpg",
      price: 12.5,
      quantity: 2,
    },
    {
      name: "医用棉签",
      type: "医疗器械",
      image: "/images/cotton_swab.jpg",
      price: 6.8,
      quantity: 3,
    },
  ]);

  const removeItem = (index: number) => {
    cartItems.value.splice(index, 1);
  };

  const totalPrice = computed(() =>
    cartItems.value
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2),
  );

  const checkout = () => {
    ElMessage.success("结算成功！");
  };
</script>
<style lang="scss" scoped>
  .cart-page {
    padding: 30px;

    .page-title {
      font-size: 26px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #333;
      font-family: "Poppins", sans-serif;
    }

    .cart-table {
      margin-bottom: 30px;

      .product-info {
        display: flex;
        align-items: center;

        .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 15px;
          border: 1px solid #eee;
        }

        .product-details {
          .product-name {
            font-weight: 600;
            font-size: 16px;
          }

          .product-type {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
      }
    }

    .checkout-bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;

      .total {
        font-size: 18px;
        font-weight: bold;
        color: #444;

        .price {
          color: #e74c3c;
          font-size: 20px;
        }
      }
    }
  }
</style>
