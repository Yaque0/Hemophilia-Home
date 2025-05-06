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

  const selectedCategory = ref<string>("");
  const emit = defineEmits(["update:category", "filter"]); // 新增filter事件

  watch(selectedCategory, (newValue) => {
    emit("update:category", newValue);
    emit("filter", newValue); // 触发过滤事件
  });
</script>

<style lang="scss" scoped>
  $primary-color: #f28a8c;
  .category-filter {
    margin: 24px 0;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    .el-radio-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;

      .el-radio-button {
        font-size: 14px;
        color: #666;
        border-radius: 20px;
        padding: 8px 16px;
        font-weight: 500;
        transition: all 0.3s ease;
        border: 1px solid #e0e0e0;
        background-color: #f8f8f8;

        &:hover {
          background-color: #f5f5f5;
          color: #f28a8c;
          border-color: #f28a8c;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(242, 138, 140, 0.2);
        }

        &.is-checked {
          background-color: #f28a8c;
          color: white;
          border-color: #f28a8c;
          box-shadow: 0 2px 8px rgba(242, 138, 140, 0.3);

          &:hover {
            background-color: color.adjust($primary-color, $lightness: -10%);
          }
        }
      }
    }
  }
</style>
