import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "./apiConfig";

class SocketService {
  public socket: Socket | null = null;

  connect(): void {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
      });

      this.socket.on("connect", () => {
        console.log("[SocketService] Connected:", this.socket?.id);
      });

      this.socket.onAny((event, ...args) => {
        console.log(`[SocketService] Event received: ${event}`, args);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("[SocketService] Disconnected:", reason);
        // Clean up the socket instance on disconnect
        this.socket = null;
      });

      this.socket.on("connect_error", (err) => {
        console.error("[SocketService] Connection Error:", err.message);
      });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event: string, handler: (data: any) => void): void {
    this.socket?.on(event, handler);
  }

  off(event: string, handler?: (data: any) => void): void {
    this.socket?.off(event, handler);
  }

  emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }
}

const socketService = new SocketService();
export default socketService;