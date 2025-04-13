<template>
  <div class="toolbar">
    <button
      type="button"
      v-for="item in filteredItems"
      :key="item.command"
      @click="emitCommand(item)"
      :class="{
        active: isActive(item.command),
        disabled: isDisabled(item.command),
      }"
      :title="item.label"
    >
      <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
      <span v-else>{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { EditorCommand, ToolbarItem } from "./types";

  const props = defineProps<{
    items: ToolbarItem[];
    history?: {
      canUndo: boolean;
      canRedo: boolean;
    };
  }>();

  const emit = defineEmits<{
    (e: "exec", command: EditorCommand): void;
  }>();

  // 过滤无效项
  const filteredItems = computed(() => {
    return props.items.filter((item) => {
      if (item.command === "undo") return props.history?.canUndo;
      if (item.command === "redo") return props.history?.canRedo;
      return true;
    });
  });

  // 按钮状态
  const isActive = (cmd: EditorCommand) => {
    return document.queryCommandState(cmd);
  };

  const isDisabled = (cmd: EditorCommand) => {
    if (cmd === "undo") return !props.history?.canUndo;
    if (cmd === "redo") return !props.history?.canRedo;
    return false;
  };

  // 命令触发
  const emitCommand = (item: ToolbarItem) => {
    if (!isDisabled(item.command)) {
      emit("exec", item.command);
    }
  };
</script>
<style lang="scss" scoped>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
    background: #f9f9f9;
    gap: 0.5rem;

    button {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.3rem 0.6rem;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #f0f0f0;
      }

      &.active {
        background-color: #409eff;
        color: white;
        border-color: #409eff;
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .material-icons {
      font-size: 1.1rem;
    }
  }
</style>
