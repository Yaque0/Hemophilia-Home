<template>
  <div class="pagination">
    <el-pagination
      :current-page="currentPage"
      :page-size="limit"
      :total="total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(["update:page"]);

  const handlePageChange = (page: number) => {
    emit("update:page", page);
  };
</script>

<style lang="scss" scoped>
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;

    .el-pagination {
      font-size: 14px;

      .el-pagination__btn {
        background-color: #f28a8c;
        color: white;
        border-radius: 25px;
        padding: 5px 15px;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #f5b2a3;
        }
      }
    }
  }
</style>
