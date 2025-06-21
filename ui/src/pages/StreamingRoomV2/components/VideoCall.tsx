import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "../../../contexts/Auth";
import { WEBRTC_SERVER_URL } from "../../../utils/env";

interface VideoCallProps {
    roomId: string;
    onClose: () => void;
}

const TAG = "VideoCall";

const VideoCall: React.FC<VideoCallProps> = ({ roomId, onClose }) => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const { user } = useAuth();
    const [permission, setPermission] = useState<"pending" | "granted" | "denied">("pending");
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "connecting" | "in-call" | "ended">("idle");

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setPermission("granted");
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                setStatus("connecting");
                startSignaling(stream);
            })
            .catch((err) => {
                setPermission("denied");
                setError("Camera/mic permission denied or not available.");
            });
        return () => {
            cleanup();
        };
    }, []);

    const startSignaling = (stream: MediaStream) => {
        console.log(TAG, "startSignaling");
        const socket = io(WEBRTC_SERVER_URL);
        socketRef.current = socket;
        socket.emit("join", roomId, user?.email ?? "");

        socket.on("other-user", async (userId: string, email: string) => {
            console.log(TAG, "other-user", userId, email);
            await createOffer(userId);
        });

        socket.on("user-joined", async (userId: string, email: string) => {
            console.log(TAG, "user-joined", userId, email);
            // Another user joined after you
        });

        socket.on("offer", async ({ from, offer }, email: string) => {
            console.log(TAG, "offer", from, offer, email);
            await createAnswer(from, offer);
        });

        socket.on("answer", ({ from, answer }, email: string) => {
            console.log(TAG, "answer", from, answer, email);
            if (peerRef.current && peerRef.current.signalingState !== "stable") {
                peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                setStatus("in-call");
            }
        });

        socket.on("ice-candidate", ({ from, candidate }, email: string) => {
            console.log(TAG, "ice-candidate", from, candidate, email);
            peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("user-disconnected", (email: string) => {
            console.log(TAG, "user-disconnected", email);
            setStatus("ended");
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
            peerRef.current?.close();
            peerRef.current = null;
        });
    };

    const createPeerConnection = (targetSocketId: string) => {
        console.log(TAG, "createPeerConnection", targetSocketId);
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peer.onicecandidate = (e) => {
            console.log(TAG, "onicecandidate", e);
            if (e.candidate) {
                socketRef.current?.emit(
                    "ice-candidate",
                    {
                        to: targetSocketId,
                        candidate: e.candidate,
                    },
                    user?.email ?? ""
                );
            }
        };
        peer.ontrack = (e) => {
            console.log(TAG, "ontrack", e);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = e.streams[0];
            }
        };
        localStreamRef.current?.getTracks().forEach((track) => {
            console.log(TAG, "addTrack", track);
            peer.addTrack(track, localStreamRef.current!);
        });
        peerRef.current = peer;
        return peer;
    };

    const createOffer = async (targetId: string) => {
        console.log(TAG, "createOffer", targetId);
        const peer = createPeerConnection(targetId);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socketRef.current?.emit("offer", { to: targetId, offer }, user?.email ?? "");
    };

    const createAnswer = async (from: string, offer: RTCSessionDescriptionInit) => {
        console.log(TAG, "createAnswer", from, offer);
        const peer = createPeerConnection(from);
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socketRef.current?.emit("answer", { to: from, answer }, user?.email ?? "");
        setStatus("in-call");
    };

    const cleanup = () => {
        console.log(TAG, "cleanup");
        peerRef.current?.close();
        peerRef.current = null;
        socketRef.current?.disconnect();
        socketRef.current = null;
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
            <div className="w-full h-1/2 flex-1 relative">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover bg-black rounded-lg"
                    style={{ minWidth: 0 }}
                />
            </div>
            <div className="w-full h-1/2 aspect-video relative">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover bg-black rounded-lg"
                    style={{ minWidth: 0 }}
                />
            </div>
        </div>
    );
};

export default VideoCall;
