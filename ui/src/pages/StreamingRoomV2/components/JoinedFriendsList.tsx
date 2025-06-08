import React, { useContext, useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { getFriendsList, Friend } from "../../../api/profile";
import { addFriendsToRoom } from "../../../api/streamingRoom";
import { useParams } from "react-router-dom";
import AuthContext, { useAuth } from "../../../contexts/Auth";

interface JoinedFriendsListProps {
    friendsEmail: string[];
    creatorEmail: string;
}

const JoinedFriendsList: React.FC<JoinedFriendsListProps> = ({ friendsEmail, creatorEmail }) => {
    const { roomId } = useParams<{ roomId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allFriends, setAllFriends] = useState<Friend[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { user } = useAuth();

    const openModal = async () => {
        setIsModalOpen(true);
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const resp = await getFriendsList();
            setAllFriends(resp.friends);
        } catch (e) {
            setError("Failed to fetch friends");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFriendsList().then((resp) => {
            setAllFriends(resp.friends);
        });
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
        setSelected([]);
        setError(null);
        setSuccess(null);
    };

    const handleSelect = (email: string) => {
        setSelected((prev) => (prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]));
    };

    const handleAddFriends = async () => {
        if (!roomId) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await addFriendsToRoom({ roomId, friends: selected });
            setSuccess("Friends added to room!");
            setSelected([]);
            closeModal();
        } catch (e) {
            setError("Failed to add friends to room");
        } finally {
            setLoading(false);
        }
    };

    // Map allFriends to local Friend type for display
    const mappedFriends = allFriends
        .filter((f) => f.email !== user?.email && !friendsEmail.includes(f.email) && f.email !== creatorEmail)
        .map((f) => ({
            name: f.name,
            username: f.email,
            status: "Invite", // default status for modal list
        }));

    return (
        <div className="bg-white/80 rounded-2xl border border-pink-100 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Friends in Room</h3>
            <div className="space-y-3">
                {friendsEmail.map((friendEmail, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <FiUser className="text-pink-400" size={20} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-400" />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                            <p className="text-sm font-medium text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
                                {friendEmail.split("@")[0]}
                            </p>
                            <p className="text-xs text-gray-500 break-all max-w-[180px]">{friendEmail}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">Online</span>
                    </div>
                ))}
            </div>
            {creatorEmail === user?.email && (
                <button
                    className="mt-6 w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
                    type="button"
                    onClick={openModal}
                >
                    Add Friend
                </button>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-4">Add Friends to Room</h2>
                        {loading && <div className="text-center text-pink-500">Loading...</div>}
                        {error && <div className="text-center text-red-500 mb-2">{error}</div>}
                        {success && <div className="text-center text-green-500 mb-2">{success}</div>}
                        <div className="max-h-60 overflow-y-auto mb-4">
                            {mappedFriends.length === 0 && !loading && (
                                <div className="text-gray-400 text-center">No friends found</div>
                            )}
                            {mappedFriends.map((f) => (
                                <label key={f.username} className="flex items-center gap-2 py-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(f.username)}
                                        onChange={() => handleSelect(f.username)}
                                        className="accent-pink-500"
                                    />
                                    <span className="font-medium">{f.name}</span>
                                    <span className="text-xs text-gray-400">{f.username}</span>
                                </label>
                            ))}
                        </div>

                        <button
                            className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold disabled:opacity-50"
                            type="button"
                            onClick={handleAddFriends}
                            disabled={selected.length === 0 || loading}
                        >
                            Add to Room
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinedFriendsList;
