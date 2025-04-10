<template>
  <div class="category-filter">
    <el-radio-group v-model="selectedCategory">
      <el-radio-button
        v-for="(category, index) in categories"
        :key="index"
        :value="category.value"
      >
        {{ category.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";

  // 定义类型
  interface Category {
    label: string;
    value: string;
  }

  const props = defineProps({
    categories: {
      type: Array as () => Category[],
      default: () => [
        { label: "全部", value: "" },
        { label: "护理知识", value: "护理知识" },
        { label: "用药经验", value: "用药经验" },
        { label: "生活分享", value: "生活分享" },
        { label: "求助咨询", value: "求助咨询" },
      ],
    },
  });

  // 绑定的值的类型
  const selectedCategory = ref<string>("");

  // 使用 v-model 双向绑定
  const emit = defineEmits(["update:category"]);

  // Watcher 确保值发生变化时更新父组件
  watch(selectedCategory, (newValue) => {
    emit("update:category", newValue);
  });
</script>

<style lang="scss" scoped>
  .category-filter {
    margin-top: 20px;
    .el-radio-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      .el-radio-button {
        font-size: 14px;
        color: #333;
        border-radius: 25px; // 圆角
        padding: 5px 15px;
        font-weight: 600;

        &:hover {
          background-color: #ffd9d0;
          color: #f28a8c;
        }

        &.is-checked {
          background-color: #f28a8c;
          color: white;
        }
      }
    }
  }
</style>
