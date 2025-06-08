import { io, Socket } from "socket.io-client";
import { getEnvVar, SOCKET_SERVER_URL } from "../utils/env";

interface SocketEvents {
    play: (roomId: string, email: string | undefined, time: number) => void;
    pause: (roomId: string, email: string | undefined, time: number) => void;
    seek: (roomId: string, email: string | undefined, time: number) => void;
    onProgress: (roomId: string, email: string | undefined, time: number) => void;
    updateVideoUrl: (roomId: string, email: string | undefined, videoUrl: string) => void;
    joinRoom: (roomId: string, email: string | undefined) => void;
    leaveRoom: (roomId: string, email: string | undefined) => void;
    chatMessage: (roomId: string, email: string | undefined, message: string) => void;
    chatHistory: (roomId: string, email: string | undefined) => void;
    userJoined: (roomId: string, email: string | undefined) => void;
    userLeft: (roomId: string, email: string | undefined) => void;
}

class SocketService {
    private socket: Socket | null = null;
    private roomId: string | null = null;
    private userEmail: string | null = null;
    private isCreator: boolean = false;
    private eventHandlers: Map<string, Set<Function>> = new Map();

    initialize(roomId: string, userEmail: string | undefined, isCreator: boolean) {
        if (this.socket) {
            this.cleanup();
        }

        this.roomId = roomId;
        this.userEmail = userEmail || null;
        this.isCreator = isCreator;

        this.socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
            path: "/socket",
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            query: {
                email: userEmail,
                roomId: roomId,
            },
        });

        this.setupEventListeners();
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("Connected to socket server");
            if (this.roomId) {
                this.emit("joinRoom", this.roomId, this.userEmail || undefined);
            }
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
            if (this.roomId) {
                this.emit("leaveRoom", this.roomId, this.userEmail || undefined);
            }
        });

        // Set up other event listeners
        const events: (keyof SocketEvents)[] = [
            "play",
            "pause",
            "seek",
            "onProgress",
            "updateVideoUrl",
            "chatMessage",
            "userJoined",
            "userLeft",
        ];
        events.forEach((event) => {
            this.socket?.on(event, (...args: any[]) => {
                const handlers = this.eventHandlers.get(event);
                if (handlers) {
                    handlers.forEach((handler) => handler(...args));
                }
            });
        });
    }

    on<K extends keyof SocketEvents>(event: K, handler: (...args: any[]) => void) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)?.add(handler);
    }

    off<K extends keyof SocketEvents>(event: K, handler: (...args: any[]) => void) {
        this.eventHandlers.get(event)?.delete(handler);
    }

    emit<K extends keyof SocketEvents>(event: K, ...args: Parameters<SocketEvents[K]>) {
        if (!this.socket?.connected) {
            console.warn("Socket not connected, cannot emit event:", event);
            return;
        }

        // Only allow control events if user is creator
        if (!this.isCreator && ["play", "pause", "seek"].includes(event)) {
            console.log("Non-creator user cannot emit control events");
            return;
        }

        console.log("Emitting socket event:", event, "with args:", args);
        this.socket.emit(event, ...args);
    }

    cleanup() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.eventHandlers.clear();
        this.roomId = null;
        this.userEmail = null;
        this.isCreator = false;
    }
}

export const socketService = new SocketService();
