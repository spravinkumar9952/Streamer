import React, { useState } from "react";
import { FiUsers, FiClock, FiVideo, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface RoomInfoBarProps {
    roomName: string;
    creatorEmail: string;
    activeTime: string;
    isCreator: boolean;
    onUpdateUrl: () => void;
    onLeave: () => void;
    onDelete?: () => void;
    videoTitle?: string;
}

const RoomInfoBar: React.FC<RoomInfoBarProps> = ({
    roomName,
    creatorEmail,
    activeTime,
    isCreator,
    onUpdateUrl,
    onLeave,
    onDelete,
    videoTitle,
}) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="bg-background-card border border-border-light p-4 rounded-card shadow-card">
            {/* Mobile: Toggle bar */}
            <div
                className="flex md:hidden items-center justify-between cursor-pointer"
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="font-bold text-base text-text-primary tracking-tight truncate">{roomName}</div>
                <button className="ml-2 p-1 rounded hover:bg-background-tertiary">
                    {expanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                </button>
            </div>
            {/* Mobile: Expanded view */}
            {expanded && (
                <div className="flex flex-col gap-2 mt-3 md:hidden">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-text-primary tracking-tight">{roomName}</span>
                        <span className="text-sm text-text-tertiary font-medium">{creatorEmail}</span>
                    </div>
                    {videoTitle && (
                        <div className="text-sm text-text-secondary flex items-center gap-1">
                            <FiVideo className="text-secondary" />
                            {videoTitle}
                        </div>
                    )}
                    <span className="flex items-center gap-1 text-sm text-text-tertiary">
                        <FiClock className="w-4 h-4 text-secondary" />
                        {activeTime} elapsed
                    </span>
                    <div className="flex flex-col gap-2 mt-2">
                        {isCreator && onDelete && (
                            <button
                                onClick={onDelete}
                                className="px-4 py-2 border border-status-error rounded-button text-status-error bg-background-card hover:bg-background-tertiary font-semibold transition-colors"
                            >
                                🗑 Delete Room
                            </button>
                        )}
                        <button
                            onClick={onLeave}
                            className="px-4 py-2 border border-border-light rounded-button text-text-primary bg-background-card hover:bg-background-tertiary font-semibold transition-colors"
                        >
                            Leave Room
                        </button>
                        {isCreator && (
                            <button
                                onClick={onUpdateUrl}
                                className="px-4 py-2 bg-button-primary-background text-button-primary-text rounded-button hover:bg-button-primary-hover transition-colors"
                            >
                                Update Video
                            </button>
                        )}
                    </div>
                </div>
            )}
            {/* Desktop: Always show full view */}
            <div className="hidden md:flex items-center justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="font-bold text-xl text-text-primary tracking-tight">{roomName}</div>
                        <div className="text-sm text-text-tertiary font-medium">{creatorEmail}</div>
                    </div>
                    {videoTitle && (
                        <div className="text-sm text-text-secondary mt-1 flex items-center gap-1">
                            <FiVideo className="text-secondary" />
                            {videoTitle}
                        </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-sm text-text-tertiary">
                            <FiClock className="w-4 h-4 text-secondary" />
                            {activeTime} elapsed
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {isCreator && onDelete && (
                        <button
                            onClick={onDelete}
                            className="px-4 py-2 border border-status-error rounded-button text-status-error bg-background-card hover:bg-background-tertiary font-semibold transition-colors"
                        >
                            🗑 Delete Room
                        </button>
                    )}
                    <button
                        onClick={onLeave}
                        className="px-4 py-2 border border-border-light rounded-button text-text-primary bg-background-card hover:bg-background-tertiary font-semibold transition-colors"
                    >
                        Leave Room
                    </button>
                    {isCreator && (
                        <button
                            onClick={onUpdateUrl}
                            className="px-4 py-2 bg-button-primary-background text-button-primary-text rounded-button hover:bg-button-primary-hover transition-colors"
                        >
                            Update Video
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomInfoBar;
