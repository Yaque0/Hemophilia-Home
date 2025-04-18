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
    const html = event.clipboardData?.getData("text/html") || "";
    if (html) {
      event.preventDefault();
      const sanitized = sanitizeHTML(html);
      document.execCommand("insertHTML", false, sanitized);
    } else {
      emit("paste", event);
    }
  };

  // 处理键盘事件
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      // 检查当前是否为空段落
      const currentNode = range.startContainer;
      const isCurrentEmpty =
        currentNode.textContent === "" && currentNode.nodeName === "P";

      const paragraph = document.createElement("p");
      paragraph.appendChild(document.createElement("br"));

      // 插入段落
      range.deleteContents();
      range.insertNode(paragraph);

      // 设置光标到新段落中
      const newRange = document.createRange();
      if (isCurrentEmpty) {
        newRange.setStart(paragraph, 0); // 跳过 <br> 标签
      } else {
        // 否则放在新段落末尾
        const textNode = document.createTextNode("");
        paragraph.appendChild(textNode);
        newRange.setStart(textNode, 0);
      }
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);
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
  onMounted(() => {
    const observer = new MutationObserver(() => {
      emit("update:content", editor.value!.innerHTML); // 改为使用正确的引用名
    });
    observer.observe(editor.value!, {
      // 使用已定义的 editor 引用
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
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
    text-align: start;
  }

  /* 修改这部分样式规则 */
  .editor-content ::v-deep([data-text-align="left"]) {
    text-align: left !important;
  }
  .editor-content ::v-deep([data-text-align="center"]) {
    text-align: center !important;
  }
  .editor-content ::v-deep([data-text-align="right"]) {
    text-align: right !important;
  }
  .editor-content ::v-deep([data-text-align="justify"]) {
    text-align: justify !important;
  }

  .editor-content ::v-deep(img) {
    max-width: 100%;
    height: auto;
  }
  .editor-content ::v-deep(u) {
    text-decoration: underline;
  }

  .editor-content ::v-deep(ol) {
    list-style-type: decimal;
    padding-left: 2em;
  }

  .editor-content ::v-deep(ul) {
    list-style-type: disc;
    padding-left: 2em;
  }
  .editor-content ::v-deep(font[color]) {
    color: attr(color);
  }

  .editor-content ::v-deep(font[size]) {
    font-size: inherit;
  }

  .editor-content ::v-deep(font[color]) {
    color: inherit !important;
  }
</style>
