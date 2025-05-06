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

<style scoped lang="scss">
  .search-bar {
    margin-bottom: 20px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .el-input {
      width: 100%;

      .el-input__inner {
        border-radius: 20px;
        padding-left: 40px;
        background: #f8f8f8;
        border: 1px solid #e0e0e0;
        transition: all 0.3s ease;

        &:focus {
          border-color: #f28a8c;
          box-shadow: 0 0 0 2px rgba(#f28a8c, 0.2);
        }
      }

      .el-input__prefix {
        left: 12px;
        color: #999;
      }
    }
  }
</style>
