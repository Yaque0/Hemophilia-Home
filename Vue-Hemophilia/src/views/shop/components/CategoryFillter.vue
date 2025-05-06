<template>
  <div class="category-filter">
    <el-button-group>
      <el-button
        v-for="cat in categories"
        :key="cat"
        :type="selected === cat ? 'primary' : 'default'"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";

  const props = defineProps<{
    categories: string[];
  }>();

  const emit = defineEmits(["select"]);
  const selected = ref("全部");

  function selectCategory(category: string) {
    selected.value = category;
    emit("select", category);
  }
</script>

<style scoped lang="scss">
  .category-filter {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    .el-button {
      font-size: 14px;
      padding: 8px 20px;
    }
  }
</style>

<style scoped lang="scss">
  $primary-color: #f28a8c;
  $hover-color: color.adjust($primary-color, $lightness: 10%);

  .category-filter {
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    // 新增响应式布局
    @media (max-width: 768px) {
      margin: 0 -15px;
      border-radius: 0;
    }

    .el-button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .el-button {
        // 优化按钮过渡效果
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        // 移动端适配
        @media (max-width: 480px) {
          flex: 1;
          min-width: 100px;
        }
      }
    }
  }
</style>
