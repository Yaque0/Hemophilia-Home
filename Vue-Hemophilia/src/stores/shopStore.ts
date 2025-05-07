import { defineStore } from "pinia";
import {
  getProducts,
  getProductDetail,
  addToCart,
  getCartList,
  updateCartItemQuantity,
  removeFromCart,
} from "@/api";
import type { ProductData, ProductQuery } from "@/types/product";
import type { CartItemData, CartItem } from "@/types/cart";

export const useShopStore = defineStore("shop", {
  state: () => ({
    products: [] as ProductData[],
    productDetail: null as ProductData | null,
    cartItems: [] as CartItem[],
    loading: false,
    error: null as string | null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
    },
  }),

  getters: {
    cartTotalItems: (state) => {
      if (!state.cartItems || state.cartItems.length === 0) return 0;
      return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    cartTotalPrice: (state) =>
      Number(
        state.cartItems?.reduce(
          (sum, item) => sum + (item.product?.price || 0) * item.quantity,
          0,
        ) || 0,
      ).toFixed(2),
    hasStock: (state) => (productId: number) => {
      const product = state.products.find((p) => p.id === productId);
      return product ? product.stock > 0 : false;
    },
  },

  actions: {
    // 商品相关操作
    async fetchProducts(params?: ProductQuery) {
      this.loading = true;
      try {
        const res = await getProducts({
          ...params,
          status: 1, // 确保只获取上架商品
          page: this.pagination.page,
          limit: this.pagination.limit,
        });
        this.pagination.total = res.data.total || 0;
        this.products = res.data.products.map((p: { stock: number }) => ({
          ...p,
          stock: Math.max(p.stock, 0), // 确保库存不为负数
        }));
      } catch (err) {
        this.error = "获取商品列表失败";
        console.error(err);
        this.cartItems = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchProductDetail(id: number) {
      this.loading = true;
      try {
        const res = await getProductDetail(id);
        this.productDetail = res.data;
      } catch (err) {
        this.error = "获取商品详情失败";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // 购物车相关操作
    async fetchCartItems() {
      this.loading = true;
      try {
        const res = await getCartList();
        console.log("API返回的购物车数据:", res.data.cartItems);
        this.cartItems = res.data.cartItems.map((item: any) => ({
          ...item,
          productId: item.product?.id,
          product: {
            ...item.product,
            price: Number(item.product?.price) || 0,
          },
        }));
      } catch (err) {
        this.error = "获取购物车失败";
        this.cartItems = [];
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async addItemToCart(data: CartItemData) {
      try {
        // 添加认证头和参数校验
        await addToCart(
          {
            productId: data.productId,
            quantity: data.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        await this.fetchCartItems();
      } catch (err: any) {
        this.error =
          err.response?.data?.errors?.[0]?.msg || "添加失败，请检查登录状态";
        console.error("完整错误:", err.response?.data);
        throw err;
      }
    },

    async updateCartItem(id: number, quantity: number) {
      try {
        await updateCartItemQuantity(id, quantity);
        await this.fetchCartItems();
      } catch (err) {
        this.error = "更新购物车失败";
        console.error(err);
        throw err;
      }
    },

    async removeCartItem(id: number) {
      try {
        await removeFromCart(id);
        await this.fetchCartItems();
      } catch (err) {
        this.error = "删除购物车商品失败";
        console.error(err);
        throw err;
      }
    },

    // 分页控制
    setPage(page: number) {
      this.pagination.page = page;
      this.fetchProducts();
    },
  },
});
