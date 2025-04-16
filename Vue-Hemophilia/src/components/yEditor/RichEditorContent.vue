<template>
  <div
    ref="editor"
    class="editor-content"
    contenteditable="true"
    @input="handleInput"
    @paste="handlePaste"
    @keydown="handleKeydown"
  ></div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  import { useEditorContext } from "@/hooks/useEditorContext";
  import { sanitizeHTML, safeLinks, preserveSelection } from "@/utils/domUtils";

  const props = defineProps<{
    content: string;
  }>();

  const emit = defineEmits(["update:content", "paste", "command"]);

  const editor = ref<HTMLElement | null>(null);
  const ctx = useEditorContext();
  const isComposing = ref(false); // 是否处于中文输入中

  // 处理输入事件
  const handleCompositionStart = () => {
    isComposing.value = true;
  };

  const handleCompositionEnd = () => {
    isComposing.value = false;
    handleInput(); // 组合结束后手动触发输入更新
  };

  const handleInput = () => {
    if (!editor.value || isComposing.value) return;

    // 保存当前选区
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

    requestAnimationFrame(() => {
      const html = editor.value!.innerHTML;
      const sanitized = sanitizeHTML(html);
      const withSafeLinks = safeLinks(sanitized);

      emit("update:content", withSafeLinks);
      ctx.handleHistory(withSafeLinks);
    });
  };

  // 处理粘贴事件
  const handlePaste = (event: ClipboardEvent) => {
    emit("paste", event);
  };

  // 处理键盘事件
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      // 处理回车键逻辑
      document.execCommand("formatBlock", false, "<p>");
    }
  };

  // 监听内容变化
  watch(
    () => props.content,
    (newVal) => {
      if (editor.value && newVal !== editor.value.innerHTML) {
        const selection = preserveSelection(editor.value);
        editor.value.innerHTML = newVal; // 更新内容
        selection?.restore(); // 恢复光标
      }
    },
  );

  // 初始化时设置内容
  onMounted(() => {
    if (editor.value) {
      editor.value.innerHTML = props.content;
    }
  });

  // 添加事件监听器
  onMounted(() => {
    if (editor.value) {
      editor.value.addEventListener("insert-image", (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        const img = document.createElement("img");
        img.src = customEvent.detail;
        img.style.maxWidth = "100%";
        document.execCommand("insertHTML", false, img.outerHTML);
      });

      editor.value.addEventListener("upload-error", (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        console.error("Upload error:", customEvent.detail);
      });

      editor.value.addEventListener("compositionstart", handleCompositionStart);
      editor.value.addEventListener("compositionend", handleCompositionEnd);
    }
  });

  defineExpose({ editorDom: editor });
</script>

<style scoped>
  .editor-content {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    min-height: 200px;
    outline: none;
  }

  .editor-content:focus {
    border-color: #aaa;
  }

  .editor-content ::v-deep(p) {
    margin: 0 0 1em 0;
  }

  .editor-content ::v-deep(img) {
    max-width: 100%;
    height: auto;
  }
</style>
