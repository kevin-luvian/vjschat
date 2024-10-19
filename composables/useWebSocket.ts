import { ref, onBeforeUnmount } from "vue";

const url = "wss://hum94ytyuc.execute-api.ap-southeast-3.amazonaws.com/$default";
const socket = ref<WebSocket | null>(null);
const isConnected = ref(false);
const messages = ref<any[]>([]);
const users = ref<any[]>([]);

type UseWebSocketOptions = {
  username: string;
  master: boolean;
};

export function useWebSocket(options: Partial<UseWebSocketOptions> = {}) {
  const connect = () => {
    console.log("TRYING TO CONNECT");
    if (socket.value) return;

    const urlParams = new URLSearchParams({ username: options.username ?? "" });
    socket.value = new WebSocket(url + `?${urlParams}`);

    socket.value.onopen = () => {
      isConnected.value = true;
      console.log("WebSocket connected");
    };

    socket.value.onclose = () => {
      isConnected.value = false;
      console.log("WebSocket disconnected");
    };

    socket.value.onmessage = (event: any) => {
      console.log("Message received:", event.data);
      const message = JSON.parse(event.data);
      const { topic, data } = message;

      if (topic == "users") users.value = data as any[];
      else if (topic == "messages") messages.value.push(data);
      else console.warn(`Received message for unknown topic: ${topic}`);
    };

    socket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const sendMessage = (message: string) => {
    if (isConnected.value && socket.value) socket.value.send(message);
    else console.error("WebSocket is not connected");
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
    }
  };

  onBeforeUnmount(() => {
    if (options.master == true) disconnect();
  });

  return {
    connect,
    sendMessage,
    disconnect,
    isConnected,
    messages,
    users,
  };
}
