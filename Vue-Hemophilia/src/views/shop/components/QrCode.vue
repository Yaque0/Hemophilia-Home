<template>
  <el-dialog v-model="visible" :title="title" width="30%">
    <div class="qrcode-container">
      <canvas ref="canvasEl"></canvas>
      <div class="qrcode-meta">
        <p v-if="expireSeconds > 0" class="expire-text">
          有效期剩余 {{ expireSeconds }} 秒
        </p>
        <el-alert
          v-if="statusMessage"
          :title="statusMessage"
          :type="statusType"
          show-icon
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, watch, onUnmounted } from "vue";
  import QRCode from "qrcode";
  import { ElMessage } from "element-plus";

  const props = defineProps({
    wsUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "扫码支付",
    },
    initialUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 600, // 总有效期秒数
    },
    usageType: {
      // 使用场景支付或登录
      type: String as () => "payment" | "login",
      default: "payment",
    },
    autoRefresh: {
      // 是否自动刷新二维码
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(["success", "expired", "error"]);

  const visible = ref(false);
  const canvasEl = ref<HTMLCanvasElement>();
  const expireSeconds = ref(0);
  const statusMessage = ref("");
  const statusType = ref("info");
  let timer: NodeJS.Timeout;
  let ws: WebSocket;
  let retryCount = 0; // 重试计数器
  const generateQrcode = async (text: string) => {
    if (canvasEl.value) {
      await QRCode.toCanvas(canvasEl.value, text, {
        width: 256,
        margin: 2,
      });
    }
  };

  const startCountdown = (secons = props.duration) => {
    expireSeconds.value = secons;
    timer = setInterval(() => {
      if (expireSeconds.value <= 0) {
        clearInterval(timer);
        emit("expired");
        statusMessage.value = "二维码已过期，请刷新重试";
        statusType.value = "error";
        return;
      }
      expireSeconds.value--;
    }, 1000);
  };

  const initWebSocket = () => {
    // 连接状态检查
    if (ws && [0, 1].includes(ws.readyState)) {
      ws.close();
    }

    // 动态生成WebSocket地址
    const wsUrl = new URL(props.wsUrl);
    wsUrl.searchParams.set("type", props.usageType);
    wsUrl.searchParams.set("token", localStorage.getItem("token") || "");
    const newWs = new WebSocket(wsUrl.toString());
    // 连接超时处理
    const timeout = setTimeout(() => {
      if (newWs.readyState === WebSocket.CONNECTING) {
        newWs.close();
        statusMessage.value = "连接超时，正在重试...";
        if (retryCount++ < 3) setTimeout(initWebSocket, 2000);
      }
    }, 5000);

    // 连接成功后，重置重试计数器
    newWs.onopen = () => {
      clearTimeout(timeout);
      retryCount = 0; // 重置重试计数器
      statusMessage.value = "连接成功，等待二维码...";
      newWs.send(JSON.stringify({ type: "INIT" }));
    };

    newWs.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // 统一处理二维码更新类型
      if (data.type === "QRCODE_UPDATE") {
        generateQrcode(data.url);
        expireSeconds.value = data.expiresIn; // 更新有效期
        clearInterval(timer);
        startCountdown(data.expiresIn);
      } else if (data.type === "PAY_SUCCESS") {
        emit("success", data);
        close();
      }
    };

    newWs.onerror = (e) => {
      emit("error", e);
      statusMessage.value = "连接异常，请检查网络";
      statusType.value = "error";
      // 3秒后重试
      if (retryCount < 3) {
        setTimeout(initWebSocket, 3000);
      }
    };
    const open = () => {
      visible.value = true;
      generateQrcode(props.initialUrl);
      startCountdown();
      initWebSocket();
    };
    newWs.onclose = (e) => {
      if (!e.wasClean && retryCount < 3) {
        setTimeout(initWebSocket, 3000);
      }
    };
    ws = newWs; //更新全局引用
  };

  onUnmounted(() => {
    close();
  });
  const open = () => {
    visible.value = true;
    generateQrcode(props.initialUrl);
    startCountdown();
    initWebSocket();
  };
  defineExpose({ open });
</script>

<style scoped>
  .qrcode-container {
    text-align: center;
    canvas {
      margin: 0 auto;
    }
    .expire-text {
      color: #f56c6c;
      margin: 12px 0;
    }
  }
</style>
