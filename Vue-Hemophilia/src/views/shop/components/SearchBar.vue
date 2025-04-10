<template>
  <div class="search-bar">
    <el-input
      v-model="search"
      placeholder="请输入商品名称"
      clearable
      @input="emitSearch"
    >
      <template #prefix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import { Search } from "@element-plus/icons-vue";

  const search = ref("");
  const emit = defineEmits(["search"]);

  const emitSearch = () => {
    emit("search", search.value.trim());
  };
</script>

<style scoped lang="scss">
  .search-bar {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;

    .el-input {
      font-size: 16px;
    }
  }
</style>
