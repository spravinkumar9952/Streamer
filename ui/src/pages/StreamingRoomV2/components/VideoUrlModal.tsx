import React, { FC } from "react";

interface VideoUrlModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    onVideoUrlChange: (url: string) => void;
    onUpdate: () => void;
    error?: string | null;
}

export const VideoUrlModal: FC<VideoUrlModalProps> = ({
    isOpen,
    onClose,
    videoUrl,
    onVideoUrlChange,
    onUpdate,
    error,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-background-card text-text-primary rounded-card border border-border-light shadow-card p-6 w-full max-w-md mx-2 relative animate-fade-in">
                <button
                    className="absolute top-3 right-3 text-text-tertiary hover:text-text-primary text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-text-primary">Update Video URL</h2>
                {error && <div className="text-status-error mb-2 text-sm font-medium">{error}</div>}
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => onVideoUrlChange(e.target.value)}
                    placeholder="Enter YouTube video URL"
                    className="w-full bg-input-background border border-input-border rounded-button px-4 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-input-focus mb-4"
                />
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-button border border-border-light text-text-primary bg-background-card hover:bg-background-tertiary font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onUpdate}
                        className="px-4 py-2 bg-button-primary-background text-button-primary-text rounded-button hover:bg-button-primary-hover font-semibold transition-colors"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};
