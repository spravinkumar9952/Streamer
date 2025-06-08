import React, { useRef, useState, forwardRef } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerSectionProps {
    room: {
        videoUrl: string;
        platform: string;
    };
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
    onSeek: (time: number) => void;
    onProgress: (state: { playedSeconds: number }) => void;
    viewOnly: boolean;
}

const VideoPlayerSection = forwardRef<ReactPlayer, VideoPlayerSectionProps>(
    ({ room, isPlaying, onPlay, onPause, onSeek, onProgress, viewOnly }, ref) => {
        return (
            <div className="bg-white/80 rounded-2xl border border-pink-100 overflow-hidden">
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <div className="absolute top-0 left-0 w-full h-full">
                        {room.videoUrl ? (
                            <ReactPlayer
                                ref={ref}
                                url={room.videoUrl}
                                playing={isPlaying}
                                width="100%"
                                height="100%"
                                controls={!viewOnly}
                                onPlay={onPlay}
                                onPause={onPause}
                                onSeek={onSeek}
                                onProgress={onProgress}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            modestbranding: 1,
                                            rel: 0,
                                            showinfo: 0,
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <div className="text-center">
                                    <div className="text-gray-400 mb-2">No video selected</div>
                                    {!viewOnly && (
                                        <button
                                            onClick={() => {
                                                /* TODO: Implement video selection */
                                            }}
                                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                        >
                                            Select Video
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

VideoPlayerSection.displayName = "VideoPlayerSection";

export default VideoPlayerSection;
