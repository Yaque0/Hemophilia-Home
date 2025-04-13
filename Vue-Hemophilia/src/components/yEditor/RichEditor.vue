<template>
  <div class="rich-editor">
    <RichEditorToolbar
      :items="toolbarItems"
      @exec="handleCommand"
      :history="history"
    />
    <RichEditorContent
      v-model="localValue"
      ref="contentRef"
      @insert-image="handleImageInsert"
      @history-change="handleHistory"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  import RichEditorToolbar from "./RichEditorToolbar.vue";
  import RichEditorContent from "./RichEditorContent.vue";
  import { createImageUploadPlugin } from "./plugins";
  import { sanitizeHTML, safeLinks } from "./domUtils";
  import type { EditorCommand, SanitizeConfig, ToolbarItem } from "./types";

  const props = defineProps<{
    modelValue: string;
    sanitizeConfig?: SanitizeConfig;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "command-executed", command: EditorCommand): void;
  }>();

  // 工具栏配置
  const toolbarItems: ToolbarItem[] = [
    { type: "button", label: "B", command: "bold" },
    { type: "button", label: "I", command: "italic" },
    { type: "button", label: "↩", command: "undo" },
    { type: "button", label: "↪", command: "redo" },
    { type: "button", label: "图片", command: "insertImage" },
  ];

  // 安全处理内容
  const sanitizeContent = (html: string) => {
    const cleaned = sanitizeHTML(html, props.sanitizeConfig);
    return safeLinks(cleaned);
  };
  const handleImageInsert = (url: string) => {
    contentRef.value?.execCommand("insertImage", url);
  };

  // 内容双向绑定
  const localValue = ref(sanitizeContent(props.modelValue));
  const contentRef = ref<InstanceType<typeof RichEditorContent>>();
  const history = ref<{ canUndo: boolean; canRedo: boolean }>({
    canUndo: false,
    canRedo: false,
  });
  // 初始化插件
  onMounted(() => {
    const plugin = createImageUploadPlugin(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.url;
    });
    plugin.install(contentRef.value?.editorEl!);
  });

  // 处理编辑器命令
  const handleCommand = (cmd: EditorCommand) => {
    switch (cmd) {
      case "undo":
      case "redo":
        contentRef.value?.[cmd]();
        break;
      default:
        contentRef.value?.execCommand(cmd);
    }
    emit("command-executed", cmd);
  };

  // 同步内容变化
  watch(
    () => props.modelValue,
    (val) => {
      const cleanHTML = sanitizeContent(val);
      if (cleanHTML !== localValue.value) {
        localValue.value = cleanHTML;
      }
    },
  );

  watch(localValue, (val) => {
    emit("update:modelValue", val);
  });

  // 历史状态更新
  const handleHistory = (state: typeof history.value) => {
    history.value = state;
  };
</script>
<style lang="scss" scoped>
  .rich-editor {
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;

    .toolbar {
      border-bottom: 1px solid #eee;
    }

    .editor-content {
      flex: 1;
      padding: 1rem;
      font-size: 1rem;
      min-height: 200px;
      max-height: 600px;
      overflow-y: auto;
      line-height: 1.6;
      word-break: break-word;
      outline: none;

      &:empty::before {
        content: attr(placeholder);
        color: #ccc;
        pointer-events: none;
      }

      img {
        max-width: 100%;
        margin: 0.5rem 0;
        border-radius: 4px;
      }

      pre,
      code {
        background-color: #f4f4f4;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
      }
    }
  }
</style>
