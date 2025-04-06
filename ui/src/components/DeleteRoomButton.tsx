import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HTTP_SERVER_URL } from "../utils/env";
import { deleteStreamingRoom } from "../api/streamingRoom";

interface DeleteRoomButtonProps {
    roomId: string;
    isCreator: boolean;
}

export const DeleteRoomButton: React.FC<DeleteRoomButtonProps> = ({ roomId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteStreamingRoom({ roomId });

            navigate("/home");
        } catch (error) {
            console.error("Error deleting room:", error);
            alert("Failed to delete room. Please try again.");
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
                Delete Room
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-background-primary p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-text-primary text-lg font-semibold mb-4">Delete Room</h3>
                        <p className="text-text-secondary mb-6">
                            Are you sure you want to delete this room? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-md text-text-primary hover:bg-background-tertiary transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
