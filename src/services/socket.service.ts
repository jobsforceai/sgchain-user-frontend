import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

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