<template>
  <div
    class="editor-content"
    contenteditable
    ref="editorEl"
    @input="handleInput"
    @paste="handlePaste"
    @keydown="handleKeyDown"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    :placeholder="placeholder"
  ></div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, nextTick } from "vue";
  import { sanitizeHTML, safeLinks, preserveSelection } from "./domUtils";
  import { useHistoryManager } from "@/hooks/useHistoryManager";
  import type { EditorCommand } from "./types";
  import { throttle } from "lodash-es";
  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "insert-image", url: string): void;
    (e: "history-change", state: { canUndo: boolean; canRedo: boolean }): void;
  }>();

  const editorEl = ref<HTMLDivElement>();
  const isComposing = ref(false); //用于处理中文输入的逻辑
  const history = useHistoryManager();
  let isInternalUpdate = false;

  const handleCompositionStart = () => (isComposing.value = true);

  const handleCompositionEnd = () => {
    isComposing.value = false;
    handleInput();
  };
  //插入图片的逻辑
  const insertImage = (url: string) => {
    const img = document.createElement("img");
    img.alt = "插入的图片";
    editorEl.value?.appendChild(img); // 将图片插入到编辑区域
  };
  //实现编辑区域的自动调整大小
  const setupAutoResize = () => {
    const editor = editorEl.value;
    if (!editor) return;
    editor.addEventListener("input", () => {
      // 这里通过设置编辑器的高度来实现自动调整
      editor.style.height = "auto";
      editor.style.height = `${editor.scrollHeight}px`;
    });
  };

  onMounted(() => {
    initContent();
    setupAutoResize();
  });

  const initContent = () => {
    editorEl.value!.innerHTML = safeLinks(sanitizeHTML(props.modelValue));
    history.push(editorEl.value!.innerHTML);
    updateHistoryState();
  };

  const execCommand = (cmd: EditorCommand, value?: string) => {
    const selection = preserveSelection(editorEl.value!);
    if (cmd === "insertImage" && value) {
      insertImage(value);
    } else {
      document.execCommand(cmd, false, value);
    }
    editorEl.value?.focus();
    selection?.restore();
    handleInput();
  };

  const throttledInput = throttle(() => {
    emit("update:modelValue", editorEl.value!.innerHTML);
  }, 300);
  const handleInput = () => {
    if (!editorEl.value || isComposing.value) return;
    if (!editorEl.value) return;
    isInternalUpdate = true;
    const newContent = editorEl.value.innerHTML;
    emit("update:modelValue", newContent);
    history.push(newContent);
    updateHistoryState();
    isInternalUpdate = false;
  };

  watch(
    () => props.modelValue,
    async (val) => {
      if (isInternalUpdate || !editorEl.value) return;
      const selection = preserveSelection(editorEl.value);
      editorEl.value.innerHTML = safeLinks(sanitizeHTML(val));
      await nextTick();
      selection?.restore();
    },
    { flush: "post" },
  );

  const updateHistoryState = () => {
    emit("history-change", {
      canUndo: history.canUndo.value,
      canRedo: history.canRedo.value,
    });
  };

  const undo = () => {
    const content = history.undo();
    if (content !== null && editorEl.value) {
      editorEl.value.innerHTML = content;
      emit("update:modelValue", content);
      updateHistoryState();
    }
  };

  const redo = () => {
    const content = history.redo();
    if (content !== null && editorEl.value) {
      editorEl.value.innerHTML = content;
      emit("update:modelValue", content);
      updateHistoryState();
    }
  };
  //粘贴处理
  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // ✅ 将 DataTransferItemList 转成数组
    const itemArray = Array.from(items);

    for (const item of itemArray) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const url = reader.result as string;
            emit("insert-image", url);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  //快捷键处理
  const handleKeyDown = (e: KeyboardEvent) => {
    // 在组合输入阶段跳过处理
    if (e.isComposing || isComposing.value) return;
    // 示Ctrl+Z 撤销、Ctrl+Y 重做
    if (e.ctrlKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "y") {
      e.preventDefault();
      redo();
    }
  };

  defineExpose({
    editorEl,
    execCommand,
    undo,
    redo,
  });
</script>
<style lang="scss" scoped>
  .editor-content {
    h1,
    h2,
    h3 {
      font-weight: bold;
      margin: 1rem 0 0.5rem;
    }

    blockquote {
      border-left: 3px solid #ccc;
      padding-left: 1rem;
      color: #666;
      font-style: italic;
      margin: 0.5rem 0;
    }

    ul,
    ol {
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }

    a {
      color: #409eff;
      text-decoration: underline;
    }
  }
</style>
