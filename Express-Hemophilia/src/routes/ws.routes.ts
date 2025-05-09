import { WebSocketServer } from "ws";
import { parse } from "url";
import { verifyToken } from "../middlewares/auth.middleware";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws, req) => {
  const { query } = parse(req.url || "", true);
  const { type, token } = query;

  // 验证 token 有效性
  if (!verifyToken(token as string)) {
    ws.close(1008, "Invalid token");
    return;
  }

  // 生成一个新的随机 ID
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const generateQRContent = (qid: string) => {
    const amount = query.amount || 0; // 从查询参数获取真实金额
    return type === "payment"
      ? `${req.headers.origin}/payment?amount=${amount}&qid=${qid}`
      : `${req.headers.origin}/login?session=${qid}`;
  };

  // 发送二维码的函数
  const sendQRCode = () => {
    const qid = generateRandomId(); // 每次发送时生成新的 ID
    console.log(`Sending QR code update to client: ${qid}`);
    ws.send(
      JSON.stringify({
        type: "QRCODE_UPDATE",
        url: generateQRContent(qid),
        expiresIn: 10,
      })
    );
  };

  // 初始发送二维码
  sendQRCode();

  // 定时更新二维码
  const timer = setInterval(() => {
    console.log(`Updating QR code every 10 seconds`);
    sendQRCode();
  }, 10000);

  ws.on("open", () => {
    console.log("WebSocket connection opened.");
    sendQRCode(); // 连接时发送初始二维码
  });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.action === "confirm") {
        console.log("Received confirmation, sending success response.");
        ws.send(
          JSON.stringify({
            type: "SUCCESS",
            result:
              type === "payment"
                ? { amount: data.amount }
                : { userId: "demo-user" },
          })
        );
      }
    } catch (err) {
      console.error("消息解析错误:", err);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
    clearInterval(timer); // 清除定时器
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clearInterval(timer); // 清除定时器
  });
});

export default wss;
