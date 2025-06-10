import React, { useMemo, useCallback, useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomHeader from "./components/RoomHeader";
import JoinedFriendsList from "./components/JoinedFriendsList";
import VideoPlayerSection from "./components/VideoPlayerSection";
import RoomInfoBar from "./components/RoomInfoBar";
import GroupChat from "./components/GroupChat";
import styles from "./StreamingRoomV2.module.css";
import { socketService } from "../../services/socketService";
import { getStreamingRoomsList, updateVideoUrl, deleteStreamingRoom } from "../../api/streamingRoom";
import AuthContext from "../../contexts/Auth";
import { VideoUrlModal } from "./components/VideoUrlModal";

interface Room {
    id: string;
    name: string;
    createdBy: string;
    created_at: string;
    videoUrl: string;
    platform: string;
    viewers: number;
    movieTitle: string;
    joinedUsers: string[];
}

interface Friend {
    name: string;
    username: string;
    status: string;
}

interface ChatMessage {
    user: string;
    time: string;
    message: string;
    isSelf?: boolean;
}

const StreamingRoomV2: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const playerRef = useRef<any>(null);
    const currentProgress = useRef(0);
    const receivedProgress = useRef(0);

    const [room, setRoom] = useState<Room | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [updateUrlError, setUpdateUrlError] = useState<string | null>(null);

    const viewOnly = useMemo(() => {
        return room?.createdBy !== user?.email;
    }, [room?.createdBy, user?.email]);

    const getFormattedTime = () =>
        new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

    useEffect(() => {
        if (!roomId || !user?.email) return;

        // Fetch room data
        getStreamingRoomsList({}).then((resp) => {
            const roomData = resp.list.find((r) => r.id === roomId);
            if (roomData) {
                setRoom({
                    ...roomData,
                    platform: "YouTube",
                    viewers: roomData.joinedUsers.length,
                    movieTitle: roomData.videoUrl
                        ? new URL(roomData.videoUrl).searchParams.get("v") || "Unknown"
                        : "No video selected",
                });

                // Initialize friends list from joined users
                const friendsList = roomData.joinedUsers.map((email) => ({
                    name: email.split("@")[0],
                    username: email,
                    status: "online",
                }));
                setFriends(friendsList);
            }
        });

        // Initialize socket with viewOnly status
        socketService.initialize(roomId, user.email, !viewOnly);

        // Request chat history when joining
        socketService.emit("chatHistory", roomId, user.email);

        // Set up event handlers
        const handlePlay = (time: number) => {
            console.log("received play", time);
            setIsPlaying(true);
            if (playerRef.current) {
                playerRef.current.seekTo(time);
            }
        };

        const handlePause = (time: number) => {
            console.log("received pause", time);
            setIsPlaying(false);
            if (playerRef.current) {
                playerRef.current.seekTo(time);
            }
        };

        const handleSeek = (time: number) => {
            console.log("received seek to " + time);
            if (playerRef.current) {
                playerRef.current.seekTo(time);
            }
        };

        const handleProgress = (time: number) => {
            console.log("received progress to " + time);
            receivedProgress.current = time;
            if (Math.abs(receivedProgress.current - currentProgress.current) > 2) {
                if (playerRef.current) {
                    playerRef.current.seekTo(time);
                }
            }
        };

        const handleUpdateVideoUrl = (videoUrl: string) => {
            setRoom((prev) => (prev ? { ...prev, videoUrl } : null));
        };

        const handleChatMessage = (email: string, message: string) => {
            console.log("received chat message", message, "from", email);
            setChat((prev) => [
                ...prev,
                {
                    user: email,
                    time: getFormattedTime(),
                    message,
                    isSelf: email === user?.email,
                },
            ]);
        };

        const handleUserJoined = (email: string) => {
            setFriends((prev) => {
                if (prev.some((f) => f.username === email)) return prev;
                return [
                    ...prev,
                    {
                        name: email.split("@")[0],
                        username: email,
                        status: "online",
                    },
                ];
            });
            setChat((prev) => [
                ...prev,
                {
                    user: "System",
                    time: getFormattedTime(),
                    message: `${email.split("@")[0]} joined the room`,
                },
            ]);
        };

        const handleUserLeft = (email: string) => {
            setFriends((prev) => prev.filter((f) => f.username !== email));
            setChat((prev) => [
                ...prev,
                {
                    user: "System",
                    time: getFormattedTime(),
                    message: `${email.split("@")[0]} left the room`,
                },
            ]);
        };

        socketService.on("play", handlePlay);
        socketService.on("pause", handlePause);
        socketService.on("seek", handleSeek);
        socketService.on("onProgress", handleProgress);
        socketService.on("updateVideoUrl", handleUpdateVideoUrl);
        socketService.on("chatMessage", handleChatMessage);
        socketService.on("userJoined", handleUserJoined);
        socketService.on("userLeft", handleUserLeft);

        return () => {
            socketService.off("play", handlePlay);
            socketService.off("pause", handlePause);
            socketService.off("seek", handleSeek);
            socketService.off("onProgress", handleProgress);
            socketService.off("updateVideoUrl", handleUpdateVideoUrl);
            socketService.off("chatMessage", handleChatMessage);
            socketService.off("userJoined", handleUserJoined);
            socketService.off("userLeft", handleUserLeft);
            socketService.cleanup();
        };
    }, [roomId, user?.email, viewOnly]);

    const handleLeaveRoom = useCallback(() => {
        if (roomId && user?.email) {
            socketService.emit("leaveRoom", roomId, user.email);
        }
        navigate("/home");
    }, [roomId, user?.email, navigate]);

    const handleSendMessage = useCallback(
        (msg: string) => {
            console.log("inside handleSendMessage, sending chat message", msg);
            if (roomId && user?.email) {
                const message = {
                    user: user.email,
                    time: getFormattedTime(),
                    message: msg,
                    isSelf: true,
                };
                console.log("sending chat message", message);
                socketService.emit("chatMessage", roomId, user.email, msg);
                setChat((prev) => [...prev, message]);
            }
        },
        [roomId, user?.email]
    );

    const handlePlay = useCallback(() => {
        if (roomId && user?.email) {
            socketService.emit("play", roomId, user.email, currentProgress.current);
        }
    }, [roomId, user?.email]);

    const handlePause = useCallback(() => {
        if (roomId && user?.email) {
            socketService.emit("pause", roomId, user.email, currentProgress.current);
        }
    }, [roomId, user?.email]);

    const handleSeek = useCallback(
        (time: number) => {
            if (roomId && user?.email) {
                socketService.emit("seek", roomId, user.email, time);
            }
        },
        [roomId, user?.email]
    );

    const handleProgress = useCallback(
        (state: { playedSeconds: number }) => {
            currentProgress.current = state.playedSeconds;
            if (roomId && user?.email) {
                socketService.emit("onProgress", roomId, user.email, state.playedSeconds);
            }
        },
        [roomId, user?.email]
    );

    const handleUpdateUrl = async () => {
        if (!roomId || !user?.email || !newVideoUrl) return;
        // Check if valid YouTube URL
        const isYoutubeUrl = newVideoUrl.includes("youtube.com/watch?v=") || newVideoUrl.includes("youtu.be/");
        if (!isYoutubeUrl) {
            setUpdateUrlError("Please enter a valid YouTube URL");
            return;
        }
        try {
            await updateVideoUrl({ roomId, videoUrl: newVideoUrl });
            // Refetch room data
            const resp = await getStreamingRoomsList({});
            const roomData = resp.list.find((r) => r.id === roomId);
            if (roomData) {
                setRoom({
                    ...roomData,
                    platform: "YouTube",
                    viewers: roomData.joinedUsers.length,
                    movieTitle: roomData.videoUrl
                        ? new URL(roomData.videoUrl).searchParams.get("v") || "Unknown"
                        : "No video selected",
                });
            }
            setIsUrlModalOpen(false);
            setNewVideoUrl("");
            setUpdateUrlError(null);
        } catch (error) {
            setUpdateUrlError("Failed to update video URL");
            console.error("Failed to update video URL:", error);
        }
    };

    const handleDeleteRoom = useCallback(async () => {
        if (!roomId) return;
        try {
            await deleteStreamingRoom({ roomId });
            navigate("/home");
        } catch (error) {
            alert("Failed to delete room");
        }
    }, [roomId, navigate]);

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <RoomHeader room={room} onLeave={handleLeaveRoom} onDelete={!viewOnly ? handleDeleteRoom : undefined} />
            <div className={styles.mainContent}>
                <JoinedFriendsList friendsEmail={room.joinedUsers} creatorEmail={room.createdBy} />
                <VideoPlayerSection
                    room={room}
                    ref={playerRef}
                    isPlaying={isPlaying}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onSeek={handleSeek}
                    onProgress={handleProgress}
                    viewOnly={viewOnly}
                />
                <GroupChat chat={chat} onSend={handleSendMessage} />
            </div>
            <RoomInfoBar
                roomName={room.name}
                activeTime={new Date(room.created_at).toLocaleTimeString()}
                isCreator={!viewOnly}
                onUpdateUrl={() => setIsUrlModalOpen(true)}
            />
            <VideoUrlModal
                isOpen={isUrlModalOpen}
                onClose={() => {
                    setIsUrlModalOpen(false);
                    setUpdateUrlError(null);
                }}
                videoUrl={newVideoUrl}
                onVideoUrlChange={setNewVideoUrl}
                onUpdate={handleUpdateUrl}
                error={updateUrlError}
            />
        </div>
    );
};

export default StreamingRoomV2;
