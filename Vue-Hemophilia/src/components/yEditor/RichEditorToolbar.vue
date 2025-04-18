<template>
  <div class="editor-toolbar">
    <template v-for="(item, index) in items" :key="index">
      <button
        type="button"
        v-if="item.type === 'button'"
        class="toolbar-button"
        :title="item.label"
        @click="emitCommand(item.command)"
        :disabled="item.disabled"
      >
        <span v-if="item.icon" class="icon">{{ item.icon }}</span>
        <span v-else>{{ item.label }}</span>
      </button>

      <div v-else-if="item.type === 'dropdown'" class="dropdown">
        <button class="toolbar-button" type="button">
          <span v-if="item.icon" class="icon">{{ item.icon }}</span>
          <span v-else>{{ item.label }}</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="dropdown-content">
          <button
            type="button"
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            @click="handleDropdownClick(item, child)"
            :disabled="child.disabled"
          >
            <span v-if="child.icon" class="icon">{{ child.icon }}</span>
            {{ child.label }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import type { ToolbarItem, EditorCommand } from "./types";

  const props = defineProps<{
    items: ToolbarItem[];
  }>();

  const emit = defineEmits(["command"]);

  const emitCommand = (command?: EditorCommand) => {
    if (command) {
      emit("command", command);
    }
  };
  const colorMap: Record<string, string> = {
    红色: "#ff0000",
    蓝色: "#0000ff",
    绿色: "#00ff00",
    黑色: "#000000",
  };
  const sizeMap: Record<string, string> = {
    小: "12",
    中: "16",
    大: "18",
  };
  const activeDropdown = ref<number | null>(null);
  const handleDropdownClick = (parent: ToolbarItem, child: ToolbarItem) => {
    if (child.command) {
      // 处理颜色选择
      if (child.command === "foreColor") {
        emit("command", "foreColor", colorMap[child.label] || "#000000");
      }
      // 处理字号选择
      else if (child.command === "fontSize") {
        emit("command", "fontSize", sizeMap[child.label] || "3");
      }
      // 其他命令
      else {
        emit("command", child.command, child.label);
      }
    }
    activeDropdown.value = null;
  };
</script>

<style scoped>
  .editor-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    padding: 4px;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }

  .toolbar-button {
    padding: 6px 10px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
  }

  .toolbar-button:hover {
    background: #eee;
  }

  .toolbar-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    top: 100%;
    left: 0;
  }

  .dropdown:hover .dropdown-content {
    display: flex;
    flex-direction: column;
  }

  .dropdown-content button {
    padding: 8px 16px;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
  }

  .dropdown-content button:hover {
    background-color: #f1f1f1;
  }
</style>
