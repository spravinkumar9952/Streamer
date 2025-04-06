import React, {
  FC,
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { io, Socket } from "socket.io-client";
import { StreamingRoom } from "../api/streamingRoom";
import { useLocation, useParams } from "react-router-dom";
import AuthContext from "../contexts/Auth";
import NavBar from "../components/NavBar";

interface StreamingRoomProps {
  streamingRoomObj: StreamingRoom;
}

interface SocketEvents {
  play: (roomId: string, email: string | undefined, time: number) => void;
  pause: (roomId: string, email: string | undefined, time: number) => void;
  seek: (roomId: string, email: string | undefined, time: number) => void;
  onProgress: (roomId: string, email: string | undefined, time: number) => void;
  joinRoom: (roomId: string, email: string | undefined) => void;
  leaveRoom: (roomId: string, email: string | undefined) => void;
}

const SOCKET_URL = "http://localhost:9998";

export const StreamingRoomPlayer: FC<StreamingRoomProps> = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { streamingRoomObj } = useLocation().state as {
    streamingRoomObj: StreamingRoom;
  };
  const { user } = useContext(AuthContext);
  const socketRef = useRef<Socket>();
  const playerRef = useRef<ReactPlayer>(null);
  const currentProgress = useRef(0);
  const receivedProgress = useRef(0);

  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isConnected: false,
    currentTime: 0,
  });

  const viewOnly = useMemo(() => {
    return streamingRoomObj.createdBy !== user?.email;
  }, [streamingRoomObj.createdBy, user?.email]);

  const initializeSocket = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
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
      socket.emit("joinRoom", roomId);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from socket server");
      setPlayerState((prev) => ({ ...prev, isConnected: false }));
      socket.emit("leaveRoom", roomId);
    };

    const handlePlay = (time: number) => {
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      syncPlayer(time);
    };

    const handlePause = (time: number) => {
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      syncPlayer(time);
    };

    const handleSeek = (time: number) => {
      console.log("received seek to " + time);
      playerRef.current?.seekTo(time, "seconds");
    };

    const handleProgress = (time: number) => {
      receivedProgress.current = time;
      if (Math.abs(receivedProgress.current - currentProgress.current) > 2) {
        syncPlayer(receivedProgress.current);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("seek", handleSeek);
    socket.on("onProgress", handleProgress);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("seek", handleSeek);
      socket.off("onProgress", handleProgress);
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
    const cleanup = initializeSocket();
    return cleanup;
  }, [initializeSocket]);

  const emitEvent = useCallback(
    <K extends keyof SocketEvents>(
      event: K,
      ...args: Parameters<SocketEvents[K]>
    ) => {
      if (!socketRef.current?.connected) {
        console.warn("Socket not connected, cannot emit event:", event);
        return;
      }
      console.log("Emitting socket event:", event, "with args:", args);
      socketRef.current.emit(event, ...args);
    },
    []
  );

  const handlePlay = useCallback(() => {
    console.log("handlePlay called", roomId, user?.email);
    if (!roomId || !user?.email) return;
    if (viewOnly) return;
    emitEvent("play", roomId, user.email, playerState.currentTime);
  }, [roomId, user?.email, emitEvent, viewOnly, playerState.currentTime]);

  const handlePause = useCallback(() => {
    console.log("handlePause called", roomId, user?.email);
    if (!roomId) return;
    if (viewOnly) return;
    emitEvent("pause", roomId, user?.email, playerState.currentTime);
  }, [roomId, user?.email, emitEvent, viewOnly, playerState.currentTime]);

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
      console.log(
        "handleProgress called with playedSeconds:",
        state.playedSeconds
      );
      if (!roomId || !user?.email) {
        console.log(
          "Cannot emit progress event - missing roomId or user email",
          { roomId, userEmail: user?.email }
        );
        return;
      }
      console.log("Emitting progress event with:", {
        roomId,
        userEmail: user?.email,
        playedSeconds: state.playedSeconds,
      });
      currentProgress.current = state.playedSeconds;
      if (viewOnly) return;
      emitEvent("onProgress", roomId, user?.email, state.playedSeconds);
    },
    [roomId, user?.email, emitEvent]
  );

  if (!roomId || !user) {
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
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-text-primary">
                {streamingRoomObj.name}
              </h2>
              <div
                className={`px-3 py-1 rounded-full flex items-center space-x-2 ${
                  playerState.isConnected
                    ? "bg-status-online bg-opacity-10 text-status-online"
                    : "bg-status-offline bg-opacity-10 text-status-offline"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    playerState.isConnected
                      ? "bg-status-online animate-pulse"
                      : "bg-status-offline"
                  }`}
                />
                <span className="text-sm font-medium">
                  {playerState.isConnected ? "Live" : "Disconnected"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <img
                  src="/png/users.png"
                  alt="Viewer"
                  className="w-8 h-8 rounded-full border-2 border-background-card"
                />
                <img
                  src="/png/users.png"
                  alt="Viewer"
                  className="w-8 h-8 rounded-full border-2 border-background-card"
                />
                <div className="w-8 h-8 rounded-full bg-background-secondary border-2 border-background-card flex items-center justify-center">
                  <span className="text-xs font-medium text-text-secondary">
                    +2
                  </span>
                </div>
              </div>
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
                  url={
                    streamingRoomObj.videoUrl ||
                    "https://youtu.be/wo_e0EvEZn8?feature=shared"
                  }
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
              <h3 className="text-xl font-semibold text-text-primary">
                Room Information
              </h3>
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
                  Room active for 2h 30m
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Creator Info */}
              <div className="bg-background-secondary rounded-card p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center">
                      <img
                        src="/png/users.png"
                        alt="Creator"
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-online rounded-full border-2 border-background-secondary"></div>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">
                      {streamingRoomObj.createdBy}
                    </p>
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
                      {new Date(streamingRoomObj.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
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

              {/* Video Info */}
              <div className="bg-background-secondary rounded-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-tertiary text-sm">Video Source</p>
                    <p className="text-text-primary font-medium">YouTube</p>
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Viewers Info */}
              <div className="bg-background-secondary rounded-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-tertiary text-sm">
                      Current Viewers
                    </p>
                    <p className="text-text-primary font-medium">4 watching</p>
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
    </div>
  );
};

export default StreamingRoomPlayer;
