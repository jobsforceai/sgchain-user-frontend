import { io, Socket } from "socket.io-client";

// The WebSocket runs on the same URL as the REST API.
// We use the NEXT_PUBLIC_API_BASE_URL environment variable, which should be set
// in your .env.local file (e.g., NEXT_PUBLIC_API_BASE_URL=http://localhost:3001).
const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class SocketService {
  public socket: Socket | null = null;

  connect(): void {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        // transports: ['websocket'], // Optional: force websocket transport
      });

      this.socket.on("connect", () => {
        console.log("[SocketService] Connected to SGChain Live Feed:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("[SocketService] Disconnected from feed:", reason);
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
      this.socket = null;
    }
  }

  on(event: string, handler: (data: any) => void): void {
    this.socket?.on(event, handler);
  }

  off(event: string, handler?: (data: any) => void): void {
    this.socket?.off(event, handler);
  }
}

// Export a singleton instance
const socketService = new SocketService();
export default socketService;
