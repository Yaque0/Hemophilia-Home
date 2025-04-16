<template>
  <div class="rich-editor">
    <RichEditorToolbar :items="toolbarItems" @command="handleCommand" />
    <RichEditorContent
      ref="editorContent"
      :content="content"
      @update:content="handleContentUpdate"
      @paste="handlePaste"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import RichEditorToolbar from "./RichEditorToolbar.vue";
  import RichEditorContent from "./RichEditorContent.vue";
  import { provideEditorContext } from "@/hooks/useEditorContext";
  import { useCommandRegistry } from "@/hooks/useCommandRegistry";
  import { sanitizeHTML, safeLinks, preserveSelection } from "@/utils/domUtils";
  import { createImageUploadPlugin } from "./plugins";
  import type { EditorCommand, EditorPlugin, ToolbarItem } from "./types";
  // 提供编辑器上下文
  const ctx = ref<ReturnType<typeof provideEditorContext> | null>(null);
  ctx.value = provideEditorContext();
  console.log("ctx", ctx.value);

  const props = defineProps<{
    modelValue: string;
    toolbarItems?: ToolbarItem[];
    plugins?: EditorPlugin[];
  }>();

  const emit = defineEmits(["update:modelValue", "command"]);

  // const editorContent = ref<HTMLElement | null>(null);
  const editorContent = ref<InstanceType<typeof RichEditorContent> | null>(
    null,
  );
  const content = ref(props.modelValue);
  const toolbarItems = props.toolbarItems ?? [];

  // 初始化命令注册
  const { registerKeyboardCommand } = useCommandRegistry();

  // 初始化插件
  const plugins = ref<EditorPlugin[]>([]);
  if (props.plugins) {
    plugins.value = props.plugins;
  }

  // 默认添加图片上传插件
  const imageUploadPlugin = createImageUploadPlugin(
    async (file) => {
      // 这里应该替换为实际的上传逻辑
      return URL.createObjectURL(file);
    },
    {
      maxSize: 5 * 1024 * 1024, // 5MB
    },
  );
  plugins.value.push(imageUploadPlugin);

  // 处理内容更新
  const handleContentUpdate = (newContent: string) => {
    content.value = newContent;
    emit("update:modelValue", newContent);
    ctx.value?.handleHistory?.(newContent);
  };

  // 处理命令
  const handleCommand = (command: EditorCommand, payload?: any) => {
    // console.log("handleCommand", command, payload);

    switch (command) {
      case "bold":
        document.execCommand("bold", false);
        break;
      case "italic":
        document.execCommand("italic", false);
        break;
      case "undo":
        const undoContent = ctx.value?.undo();
        console.log("undoContent", undoContent);

        if (
          undoContent !== undefined &&
          undoContent !== null &&
          editorContent.value?.editorDom
        ) {
          // 保存当前选区
          const selection = preserveSelection(editorContent.value.editorDom);

          editorContent.value.editorDom.innerHTML = undoContent;
          content.value = undoContent;
          emit("update:modelValue", undoContent);

          // 恢复选区
          selection?.restore();
        }

        break;
      case "redo":
        const redoContent = ctx.value?.redo();
        if (
          redoContent !== undefined &&
          redoContent !== null &&
          editorContent.value?.editorDom
        ) {
          // 保存当前选区
          const selection = preserveSelection(editorContent.value.editorDom);

          editorContent.value.editorDom.innerHTML = redoContent;
          content.value = redoContent;
          emit("update:modelValue", redoContent);

          // 恢复选区
          setTimeout(() => {
            if (editorContent.value?.editorDom) {
              const newSelection = window.getSelection();
              if (newSelection) {
                const range = document.createRange();
                // 确保我们有有效的节点
                const targetNode =
                  editorContent.value.editorDom.childNodes.length > 0
                    ? editorContent.value.editorDom.lastChild!
                    : editorContent.value.editorDom;

                range.selectNodeContents(targetNode);
                range.collapse(false); // 移动到末尾
                newSelection.removeAllRanges();
                newSelection.addRange(range);
              }
            }
          }, 0);
        }
        break;
      case "underline":
        document.execCommand("underline", false);
        break;
      case "insertOrderedList":
        document.execCommand("insertOrderedList", false);
        break;
      case "insertUnorderedList":
        document.execCommand("insertUnorderedList", false);
        break;
      case "fontColor":
        document.execCommand("fontColor", false, payload);
        break;
      case "fontSize":
        document.execCommand("fontSize", false, payload);
        break;
      case "fontName":
        document.execCommand("fontName", false, payload);
        break;
      case "justifyLeft":
        document.execCommand("justifyLeft", false);
        break;
      case "justifyCenter":
        document.execCommand("justifyCenter", false);
        break;
      case "justifyRight":
        document.execCommand("justifyRight", false);
        break;
      case "justifyFull":
        document.execCommand("justifyFull", false);
        break;
      case "insertImage":
        if (editorContent.value?.editorDom) {
          editorContent.value.editorDom.dispatchEvent(
            new CustomEvent("trigger-image-upload"),
          );
        }
        break;
      default:
        emit("command", command, payload);
    }
  };

  // 处理粘贴事件
  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData?.getData("text/plain") || "";
    const sanitized = sanitizeHTML(text);
    document.execCommand("insertHTML", false, sanitized);
  };

  // 注册键盘快捷键
  registerKeyboardCommand("z", () => {}, {
    key: "z",
    ctrl: true,
    command: "undo",
    execute: () => handleCommand("undo"),
  });

  registerKeyboardCommand("y", () => {}, {
    key: "y",
    ctrl: true,
    command: "redo",
    execute: () => handleCommand("redo"),
  });

  registerKeyboardCommand("b", () => {}, {
    key: "b",
    ctrl: true,
    command: "bold",
    execute: () => handleCommand("bold"),
  });

  registerKeyboardCommand("i", () => {}, {
    key: "i",
    ctrl: true,
    command: "italic",
    execute: () => handleCommand("italic"),
  });
  // 安装插件
  onMounted(() => {
    const editorDom = editorContent.value?.editorDom;
    if (editorDom) {
      plugins.value.forEach((plugin) => plugin.install(editorDom));
      ctx.value?.handleHistory?.(content.value); //  初次记录内容
    }
  });

  // 卸载插件
  onBeforeUnmount(() => {
    plugins.value.forEach((plugin) => plugin.uninstall?.());
  });
</script>

<style scoped>
  .rich-editor {
    border: 1px solid #ddd;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    min-height: 300px;
  }
</style>
