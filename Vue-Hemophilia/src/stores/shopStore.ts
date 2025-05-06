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
    cartTotalItems: (state) =>
      state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    cartTotalPrice: (state) =>
      state.cartItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0,
      ),
    hasStock: (state) => (productId: number) => {
      const product = state.products.find((p) => p.id === productId);
      return product ? product.stock > 0 : false;
    },
  },

  actions: {
    // 商品相关操作
    async fetchProducts(params?: ProductQuery) {
      this.loading = true;
      this.error = null;
      try {
        const res = await getProducts({
          ...params,
          page: this.pagination.page,
          limit: this.pagination.limit,
        });
        this.products = res.data.products;
        this.pagination.total = res.data.total;
      } catch (err) {
        this.error = "获取商品列表失败";
        console.error(err);
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
        this.cartItems = res.data;
      } catch (err) {
        this.error = "获取购物车失败";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async addItemToCart(data: CartItemData) {
      try {
        await addToCart(data);
        await this.fetchCartItems();
      } catch (err) {
        this.error = "添加购物车失败";
        console.error(err);
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
