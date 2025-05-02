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
  import { ref, onMounted, onBeforeUnmount, computed } from "vue";
  import RichEditorToolbar from "./RichEditorToolbar.vue";
  import RichEditorContent from "./RichEditorContent.vue";
  import { provideEditorContext } from "@/hooks/useEditorContext";
  import { useCommandRegistry } from "@/hooks/useCommandRegistry";
  import { sanitizeHTML, safeLinks, preserveSelection } from "@/utils/domUtils";
  import { createImageUploadPlugin } from "./plugins";
  import type { EditorCommand, EditorPlugin, ToolbarItem } from "./types";
  import { applyStyle } from "./commands/applyStyle";
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
  const toolbarItems = computed(() => {
    return props.toolbarItems?.length
      ? props.toolbarItems
      : defaultToolbarItems;
  });

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
    const fullHTML = editorContent.value?.editorDom?.innerHTML || newContent;
    content.value = fullHTML;
    emit("update:modelValue", fullHTML);
    ctx.value?.handleHistory?.(fullHTML);
  };

  const handleCommand = (command: EditorCommand, payload?: any) => {
    switch (command) {
      case "undo":
        const undoContent = ctx.value?.undo();
        if (undoContent !== undefined && editorContent.value?.editorDom) {
          // 保存当前选区
          const selection = preserveSelection(editorContent.value.editorDom);

          editorContent.value.editorDom.innerHTML = undoContent;
          content.value = undoContent;
          emit("update:modelValue", undoContent);

          // 增强的选区恢复逻辑
          if (undoContent === "") {
            // 处理空内容的情况
            const emptySpan = document.createElement("span");
            emptySpan.innerHTML = "&#8203;"; // 零宽空格
            editorContent.value.editorDom.appendChild(emptySpan);
            const range = document.createRange();
            range.selectNodeContents(emptySpan);
            range.collapse(true);
            selection?.restore();
            handleContentUpdate(undoContent); // 触发内容更新
          } else {
            selection?.restore();
          }
          editorContent.value.editorDom.focus();
        }
        break;
      case "redo":
        const redoContent = ctx.value?.redo();
        if (redoContent !== undefined && editorContent.value?.editorDom) {
          // 保存当前选区
          const selection = preserveSelection(editorContent.value.editorDom);
          editorContent.value.editorDom.innerHTML = redoContent;
          content.value = redoContent;
          emit("update:modelValue", redoContent);

          // 统一使用restore方法
          if (redoContent === "") {
            const emptySpan = document.createElement("span");
            emptySpan.innerHTML = "&#8203;";
            editorContent.value.editorDom.appendChild(emptySpan);
            const range = document.createRange();
            range.selectNodeContents(emptySpan);
            range.collapse(true);
            handleContentUpdate(redoContent); // 触发内容更新
            selection?.restore();
          } else {
            selection?.restore();
          }

          editorContent.value.editorDom.focus();
        }
      case "bold":
        applyStyle("font-weight", "bold");
        break;
      case "italic":
        applyStyle("font-style", "italic");
        break;
      case "underline":
        applyStyle("text-decoration", "underline");
        break;
      case "insertOrderedList":
        applyListStyle("ol");
        break;
      case "insertUnorderedList":
        applyListStyle("ul");
        break;
      case "foreColor":
        applyStyle("color", payload);
        break;
      case "fontSize":
        applyStyle("font-size", `${payload}px`);
        break;
      case "fontName":
        applyStyle("font-family", payload);
        break;
      case "justifyLeft":
        applyTextAlignment("left");
        break;
      case "justifyCenter":
        applyTextAlignment("center");
        break;
      case "justifyRight":
        applyTextAlignment("right");
        break;
      case "justifyFull":
        applyTextAlignment("justify");
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

  // 列表处理函数
  const applyListStyle = (listType: "ol" | "ul") => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const list = document.createElement(listType);
    const li = document.createElement("li");

    li.appendChild(range.extractContents());
    list.appendChild(li);
    range.insertNode(list);

    // 选中新插入的内容
    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  // 处理粘贴事件
  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData?.getData("text/plain") || "";
    const sanitized = sanitizeHTML(text);
    document.execCommand("insertHTML", false, sanitized);
  };
  const applyTextAlignment = (alignment: string) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    // 保存选区状态
    const savedSelection = preserveSelection(editorContent.value?.editorDom!);

    const blocks = getBlockElements(range);

    // 遍历并设置对齐方式
    blocks.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.cssText += `text-align: ${alignment} !important;`;
        el.setAttribute("data-text-align", alignment);
      }
    });
    // 强制触发内容更新
    handleContentUpdate(editorContent.value?.editorDom?.innerHTML || "");

    // 恢复选区并聚焦
    savedSelection?.restore();
    editorContent.value?.editorDom?.focus();
  };
  const defaultToolbarItems: ToolbarItem[] = [
    {
      type: "button",
      label: "加粗",
      command: "bold",
      icon: "B",
    },
    {
      type: "button",
      label: "斜体",
      command: "italic",
      icon: "I",
    },
    {
      type: "button",
      label: "Undo",
      command: "undo",
      icon: "↩",
    },
    {
      type: "button",
      label: "Redo",
      command: "redo",
      icon: "↪",
    },
    {
      type: "button",
      label: "图片",
      command: "insertImage",
      icon: "📷",
    },
    {
      type: "button",
      label: "下划线",
      command: "underline",
      icon: "U",
    },
    {
      type: "button",
      label: "有序列表",
      command: "insertOrderedList",
      icon: "1.",
    },
    {
      type: "button",
      label: "无序列表",
      command: "insertUnorderedList",
      icon: "•",
    },
    {
      type: "dropdown",
      label: "字号",
      icon: "🔠",
      children: [
        { type: "button", label: "小", command: "fontSize", icon: "12px" },
        { type: "button", label: "中", command: "fontSize", icon: "16px" },
        { type: "button", label: "大", command: "fontSize", icon: "18px" },
      ],
    },
    {
      type: "dropdown",
      label: "颜色",
      icon: "🎨",
      children: [
        { type: "button", label: "红色", command: "foreColor", icon: "🔴" },
        { type: "button", label: "蓝色", command: "foreColor", icon: "🔵" },
        { type: "button", label: "绿色", command: "foreColor", icon: "🟢" },
        { type: "button", label: "黑色", command: "foreColor", icon: "⚫" },
      ],
    },
    {
      type: "dropdown",
      label: "字体",
      icon: "🖋️",
      children: [
        { type: "button", label: "宋体", command: "fontName" },
        { type: "button", label: "黑体", command: "fontName" },
        { type: "button", label: "微软雅黑", command: "fontName" },
        { type: "button", label: "Arial", command: "fontName" },
      ],
    },
    {
      type: "dropdown",
      label: "对齐",
      icon: "≡",
      children: [
        { type: "button", label: "左对齐", command: "justifyLeft", icon: "←" },
        { type: "button", label: "居中", command: "justifyCenter", icon: "↔" },
        { type: "button", label: "右对齐", command: "justifyRight", icon: "→" },
        {
          type: "button",
          label: "两端对齐",
          command: "justifyFull",
          icon: "⇄",
        },
      ],
    },
  ];
  // 增强块级元素检测
  const getBlockElements = (range: Range): HTMLElement[] => {
    const blocks = new Set<HTMLElement>();

    // 获取选区起始节点的最近块级父元素
    const startContainer = range.startContainer;
    let block: HTMLElement | null = null;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      block = startContainer.parentElement;
    } else {
      block = startContainer as HTMLElement;
    }

    // 向上查找最近的块级元素
    while (block && !isBlockElement(block)) {
      block = block.parentElement;
    }

    if (block && isBlockElement(block)) {
      blocks.add(block);
    }

    return Array.from(blocks);
  };

  const isBlockElement = (el: HTMLElement): boolean => {
    const display = getComputedStyle(el).display;
    return (
      display === "block" ||
      display === "flex" ||
      display === "list-item" ||
      el.tagName === "P" ||
      el.tagName === "DIV" ||
      el.tagName === "LI" ||
      el.tagName === "H1" ||
      el.tagName === "H2" ||
      el.tagName === "H3" ||
      el.tagName === "H4" ||
      el.tagName === "H5" ||
      el.tagName === "H6"
    );
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
