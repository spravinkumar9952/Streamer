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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Update Video URL</h2>
                {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => onVideoUrlChange(e.target.value)}
                    placeholder="Enter video URL"
                    className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                        Cancel
                    </button>
                    <button onClick={onUpdate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};
