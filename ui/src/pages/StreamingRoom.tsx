import React, { FC, useEffect, useRef, useState, useCallback, useContext } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { io, Socket } from "socket.io-client";
import { StreamingRoom } from "../api/streamingRoom";
import { useParams } from "react-router-dom";
import AuthContext from "../contexts/Auth";

interface StreamingRoomProps {
  streamingRoomObj: StreamingRoom;
}

interface SocketEvents {
  play: (roomId: string, email: string) => void;
  pause: (roomId: string) => void;
  seek: (data: { roomId: string; time: number }) => void;
  onProgress: (data: { roomId: string; time: number }) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

const SOCKET_URL = "http://localhost:9998";

export const StreamingRoomPlayer: FC<StreamingRoomProps> = ({ streamingRoomObj }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useContext(AuthContext); // Get current user from auth context
  const socketRef = useRef<Socket>();
  const playerRef = useRef<ReactPlayer>(null);
  const movedToProgress = useRef(false);

  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isConnected: false,
    currentTime: 0,
  });

  const initializeSocket = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        query: {
          email: user?.email,
          roomId: roomId
        }
      });
    }

    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("Connected to socket server");
      setPlayerState(prev => ({ ...prev, isConnected: true }));
      socket.emit("joinRoom", roomId);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from socket server");
      setPlayerState(prev => ({ ...prev, isConnected: false }));
      socket.emit("leaveRoom", roomId);
    };

    const handlePlay = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleSeek = (time: number) => {
      playerRef.current?.seekTo(time, "seconds");
    };

    const handleProgress = (time: number) => {
      if (!movedToProgress.current) {
        playerRef.current?.seekTo(time, "seconds");
        movedToProgress.current = true;
      }
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("seek", handleSeek);
    socket.on("onProgress", handleProgress);

    // Cleanup function
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("seek", handleSeek);
      socket.off("onProgress", handleProgress);
    };
  }, [roomId, user?.email]);

  useEffect(() => {
    const cleanup = initializeSocket();
    return cleanup;
  }, [initializeSocket]);

  const emitEvent = useCallback(<K extends keyof SocketEvents>(
    event: K,
    ...args: Parameters<SocketEvents[K]>
  ) => {
    if (!socketRef.current?.connected) {
      console.warn("Socket not connected");
      return;
    }
    socketRef.current.emit(event, ...args);
  }, []);

  const handlePlay = useCallback(() => {
    if (!roomId || !user?.email) return;
    emitEvent("play", roomId, user.email);
  }, [roomId, user?.email, emitEvent]);

  const handlePause = useCallback(() => {
    if (!roomId) return;
    emitEvent("pause", roomId);
  }, [roomId, emitEvent]);

  const handleSeek = useCallback((seconds: number) => {
    if (!roomId) return;
    emitEvent("seek", { roomId, time: seconds });
  }, [roomId, emitEvent]);

  const handleProgress = useCallback((state: OnProgressProps) => {
    if (!roomId) return;
    emitEvent("onProgress", { roomId, time: state.playedSeconds });
  }, [roomId, emitEvent]);

  if (!roomId || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="streaming-room">
      <div className="streaming-room-header">
        <h2>{streamingRoomObj.name}</h2>
        <div className="connection-status">
          Status: {playerState.isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
      <div className="video-container">
        <ReactPlayer
          ref={playerRef}
          url={
            streamingRoomObj.videoUrl ? streamingRoomObj.videoUrl : "https://youtu.be/wo_e0EvEZn8?feature=shared"
          }
          playing={playerState.isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onProgress={handleProgress}
          controls={true}
          width="100%"
          height="auto"
        />
      </div>
    </div>
  );
};


