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
