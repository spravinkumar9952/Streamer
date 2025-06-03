import React, { FC, useEffect, useRef, useState, useCallback, useContext, useMemo } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { io, Socket } from "socket.io-client";
import { getStreamingRoomsList, StreamingRoom } from "../api/streamingRoom";
import { useLocation, useParams } from "react-router-dom";
import AuthContext from "../contexts/Auth";
import NavBar from "../components/NavBar";
import { getEnvVar, SOCKET_SERVER_URL } from "../utils/env";
import { updateVideoUrl } from "../api/streamingRoom";
import { DeleteRoomButton } from "../components/DeleteRoomButton";
import { convertMinutesToTimeString } from "../utils/time";

interface StreamingRoomProps {
    streamingRoomObj: StreamingRoom | undefined;
}

interface SocketEvents {
    play: (roomId: string, email: string | undefined, time: number) => void;
    pause: (roomId: string, email: string | undefined, time: number) => void;
    seek: (roomId: string, email: string | undefined, time: number) => void;
    onProgress: (roomId: string, email: string | undefined, time: number) => void;
    updateVideoUrl: (roomId: string, email: string | undefined, videoUrl: string) => void;
    joinRoom: (roomId: string, email: string | undefined) => void;
    leaveRoom: (roomId: string, email: string | undefined) => void;
}

export const StreamingRoomPlayer: FC<StreamingRoomProps> = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const props = useLocation().state as StreamingRoomProps;

    const [streamingRoomObj, setStreamingRoomObj] = useState<StreamingRoom | undefined>(props.streamingRoomObj);
    const { user } = useContext(AuthContext);
    const socketRef = useRef<Socket>();
    const playerRef = useRef<ReactPlayer>(null);
    const currentProgress = useRef(0);
    const receivedProgress = useRef(0);
    const roomActiveTimer = useRef<NodeJS.Timeout | null>(null);
    const [roomActiveMinutes, setRoomActiveMinutes] = useState(0);

    const startRoomActiveTimer = useCallback((createdAt: string) => {
        if (roomActiveTimer.current) {
            clearInterval(roomActiveTimer.current);
        }
        console.log("createdAt", createdAt);
        const now = new Date();
        const createdAtDate = new Date(createdAt);
        console.log("now", now);
        console.log("createdAtDate", createdAtDate);
        const diff = now.getTime() - createdAtDate.getTime();
        const minutes = Math.floor(diff / 60000);
        setRoomActiveMinutes(minutes);
        console.log("minutes", minutes);
        console.log("Room active for", minutes, "minutes");
        roomActiveTimer.current = setInterval(() => {
            setRoomActiveMinutes((prev) => prev + 1);
        }, 60000);
    }, []);

    useEffect(() => {
        if (props.streamingRoomObj) {
            setStreamingRoomObj(props.streamingRoomObj);
            startRoomActiveTimer(props.streamingRoomObj.created_at);
        } else {
            getStreamingRoomsList({}).then((resp) => {
                const room = resp.list.find((room) => room.id === roomId);
                if (room) {
                    setStreamingRoomObj(room);
                    startRoomActiveTimer(room.created_at);
                }
            });
        }
    }, [props.streamingRoomObj, roomId]);

    const [playerState, setPlayerState] = useState({
        isPlaying: false,
        isConnected: false,
        currentTime: 0,
    });

    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState("");

    const viewOnly = useMemo(() => {
        return streamingRoomObj?.createdBy !== user?.email;
    }, [streamingRoomObj?.createdBy, user?.email]);

    const initializeSocket = useCallback(() => {
        console.log("initializing socket", user?.email, roomId);
        if (!socketRef.current) {
            console.log("initializing socket", user?.email, roomId);
            socketRef.current = io(SOCKET_SERVER_URL, {
                transports: ["websocket"],
                path: "/socket",
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                query: {
                    email: user?.email,
                    roomId: roomId,
                },
            });
        }

        const socket = socketRef.current;

        const handleConnect = () => {
            console.log("Connected to socket server");
            setPlayerState((prev) => ({ ...prev, isConnected: true }));
            if (socketRef.current) {
                socketRef.current.emit("joinRoom", roomId);
            } else {
                console.error("Socket not connected");
            }
        };

        const handleDisconnect = () => {
            console.log("Disconnected from socket server");
            setPlayerState((prev) => ({ ...prev, isConnected: false }));
            if (socketRef.current) {
                socketRef.current.emit("leaveRoom", roomId);
            } else {
                console.error("Socket not connected");
            }
        };

        const handlePlay = (time: number) => {
            console.log("received play", time);
            setPlayerState((prev) => ({ ...prev, isPlaying: true }));
            syncPlayer(time);
        };

        const handlePause = (time: number) => {
            console.log("received pause", time);
            setPlayerState((prev) => ({ ...prev, isPlaying: false }));
            syncPlayer(time);
        };

        const handleSeek = (time: number) => {
            console.log("received seek to " + time);
            playerRef.current?.seekTo(time, "seconds");
        };

        const handleProgress = (time: number) => {
            console.log("received progress to " + time);
            receivedProgress.current = time;
            if (Math.abs(receivedProgress.current - currentProgress.current) > 2) {
                syncPlayer(receivedProgress.current);
            }
        };

        const handleUpdateVideoUrl = (roomId: string, email: string | undefined, videoUrl: string) => {
            setStreamingRoomObj((prev) => {
                if (prev) {
                    return { ...prev, videoUrl: videoUrl };
                }
                return prev;
            });
        };

        if (socketRef.current) {
            socketRef.current.on("connect", handleConnect);
            socketRef.current.on("disconnect", handleDisconnect);
            socketRef.current.on("play", handlePlay);
            socketRef.current.on("pause", handlePause);
            socketRef.current.on("seek", handleSeek);
            socketRef.current.on("onProgress", handleProgress);
            socketRef.current.on("updateVideoUrl", handleUpdateVideoUrl);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off("connect", handleConnect);
                socketRef.current.off("disconnect", handleDisconnect);
                socketRef.current.off("play", handlePlay);
                socketRef.current.off("pause", handlePause);
                socketRef.current.off("seek", handleSeek);
                socketRef.current.off("onProgress", handleProgress);
                socketRef.current.off("updateVideoUrl", handleUpdateVideoUrl);
            }
        };
    }, [roomId, user?.email]);

    const syncPlayer = useCallback(
        (time: number) => {
            playerRef.current?.seekTo(time, "seconds");
            currentProgress.current = receivedProgress.current;
        },
        [viewOnly]
    );

    useEffect(() => {
        console.log("useEffect initializing socket", user?.email, roomId);
        const cleanup = initializeSocket();
        return cleanup;
    }, [initializeSocket]);

    const emitEvent = useCallback(<K extends keyof SocketEvents>(event: K, ...args: Parameters<SocketEvents[K]>) => {
        if (!socketRef.current?.connected) {
            console.warn("Socket not connected, cannot emit event:", event);
            return;
        }
        console.log("Emitting socket event:", event, "with args:", args);
        socketRef.current.emit(event, ...args);
    }, []);

    const handlePlay = useCallback(() => {
        console.log("handlePlay called", roomId, user?.email, currentProgress.current);
        if (!roomId || !user?.email) return;
        if (viewOnly) return;
        emitEvent("play", roomId, user.email, currentProgress.current);
    }, [roomId, user?.email, emitEvent, viewOnly, currentProgress.current]);

    const handlePause = useCallback(() => {
        console.log("handlePause called", roomId, user?.email, currentProgress.current);
        if (!roomId) return;
        if (viewOnly) return;
        emitEvent("pause", roomId, user?.email, currentProgress.current);
    }, [roomId, user?.email, emitEvent, viewOnly, currentProgress.current]);

    const handleSeek = useCallback(
        (seconds: number) => {
            console.log("handleSeek called with seconds:", seconds);
            if (!roomId || !user?.email) {
                console.log("Cannot emit seek event - missing roomId or user email", {
                    roomId,
                    userEmail: user?.email,
                });
                return;
            }
            console.log("Emitting seek event with:", {
                roomId,
                userEmail: user?.email,
                seconds,
            });
            if (viewOnly) return;
            emitEvent("seek", roomId, user?.email, seconds);
        },
        [roomId, user?.email, emitEvent]
    );

    const handleProgress = useCallback(
        (state: OnProgressProps) => {
            console.log("handleProgress called with playedSeconds:", state.playedSeconds);
            if (!roomId || !user?.email) {
                console.log("Cannot emit progress event - missing roomId or user email", {
                    roomId,
                    userEmail: user?.email,
                });
                return;
            }

            currentProgress.current = state.playedSeconds;

            console.log("currentProgress.current", viewOnly);
            if (viewOnly) return;

            console.log("Emitting progress event with:", {
                roomId,
                userEmail: user?.email,
                playedSeconds: state.playedSeconds,
            });
            emitEvent("onProgress", roomId, user?.email, state.playedSeconds);
        },
        [roomId, user?.email, emitEvent]
    );

    const handleUpdateUrl = async () => {
        try {
            if (!roomId || !user?.email) return;

            await updateVideoUrl({
                roomId: roomId,
                videoUrl: newVideoUrl,
            });

            // Update local state
            setStreamingRoomObj((prev) => {
                if (prev) {
                    return { ...prev, videoUrl: newVideoUrl };
                }
                return prev;
            });

            emitEvent("updateVideoUrl", roomId, user?.email, newVideoUrl);

            // Reset modal state
            setIsUrlModalOpen(false);
            setNewVideoUrl("");

            // Show success message
            alert("Video URL updated successfully!");
        } catch (error) {
            console.error("Failed to update video URL:", error);
            alert("Failed to update video URL. Please try again.");
        }
    };

    if (!roomId || !user || !streamingRoomObj) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-primary">
            <NavBar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Room Header */}
                    <div className="bg-background-card rounded-card shadow-card p-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">{streamingRoomObj?.name}</h1>
                            <p className="text-text-secondary mt-1">Created by {streamingRoomObj?.createdBy}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <DeleteRoomButton roomId={roomId} isCreator={streamingRoomObj?.createdBy === user?.email} />
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="bg-background-card rounded-card shadow-card overflow-hidden">
                        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                            {" "}
                            {/* 16:9 Aspect Ratio */}
                            <div className="absolute top-0 left-0 w-full h-full">
                                <ReactPlayer
                                    ref={playerRef}
                                    url={streamingRoomObj?.videoUrl}
                                    playing={playerState.isPlaying}
                                    onPlay={handlePlay}
                                    onPause={handlePause}
                                    onSeek={handleSeek}
                                    onProgress={handleProgress}
                                    controls={!viewOnly}
                                    width="100%"
                                    height="100%"
                                    style={{ position: "absolute", top: 0, left: 0 }}
                                    config={{
                                        youtube: {
                                            playerVars: {
                                                modestbranding: 1,
                                                rel: 0,
                                                showinfo: 0,
                                            },
                                        },
                                    }}
                                    progressInterval={1000}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Room Info */}
                    <div className="bg-background-card rounded-card shadow-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-text-primary">Room Information</h3>
                            <div className="flex items-center space-x-2 px-3 py-1 bg-background-secondary rounded-full">
                                <svg
                                    className="w-4 h-4 text-text-secondary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-text-secondary">
                                    Room active for {convertMinutesToTimeString(roomActiveMinutes)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Creator Info */}
                            <div className="bg-background-secondary rounded-card p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center">
                                            <img src="/png/users.png" alt="Creator" className="w-8 h-8" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-online rounded-full border-2 border-background-secondary"></div>
                                    </div>
                                    <div>
                                        <p className="text-text-primary font-medium">{streamingRoomObj?.createdBy}</p>
                                        <p className="text-text-tertiary text-sm">Room Creator</p>
                                    </div>
                                </div>
                            </div>

                            {/* Room Stats */}
                            <div className="bg-background-secondary rounded-card p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-text-tertiary text-sm">Created on</p>
                                        <p className="text-text-primary font-medium">
                                            {new Date(streamingRoomObj.created_at).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-background-tertiary flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-text-secondary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Video Source */}
                            <div className="bg-background-secondary p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-5 h-5 text-secondary-light"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-text-primary font-medium">Video Source</span>
                                    </div>
                                    <button
                                        onClick={() => setIsUrlModalOpen(true)}
                                        className="text-secondary-light hover:text-secondary-dark text-sm font-medium px-3 py-1 rounded-md bg-background-card hover:bg-background-tertiary transition-colors"
                                    >
                                        Change URL
                                    </button>
                                </div>
                                <p className="text-text-tertiary mt-2 text-sm break-all">{streamingRoomObj.videoUrl}</p>
                            </div>

                            {/* Viewers Info */}
                            <div className="bg-background-secondary rounded-card p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-text-tertiary text-sm">Current Viewers</p>
                                        <p className="text-text-primary font-medium">
                                            {streamingRoomObj.joinedUsers.length + 1} watching
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-background-tertiary flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-text-secondary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change URL Modal */}
            {isUrlModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-background-primary p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-text-primary text-lg font-semibold mb-4">Change Video URL</h3>
                        <input
                            type="text"
                            value={newVideoUrl}
                            onChange={(e) => setNewVideoUrl(e.target.value)}
                            placeholder="Enter new video URL"
                            className="w-full px-4 py-2 rounded-md bg-background-card text-text-primary border border-border-light focus:border-secondary-light focus:ring-1 focus:ring-secondary-light outline-none"
                        />
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={() => {
                                    setIsUrlModalOpen(false);
                                    setNewVideoUrl("");
                                }}
                                className="px-4 py-2 rounded-md text-text-primary hover:bg-background-tertiary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUrl}
                                className="px-4 py-2 rounded-md bg-secondary-light text-white hover:bg-secondary-dark transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreamingRoomPlayer;
