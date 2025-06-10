import React, { useContext, useEffect, useState } from "react";
import { FiUser, FiX } from "react-icons/fi";
import { getFriendsList, Friend } from "../../../api/profile";
import { addFriendsToRoom, removeFriendsFromRoom, StreamingRoom } from "../../../api/streamingRoom";
import { useParams } from "react-router-dom";
import AuthContext, { useAuth } from "../../../contexts/Auth";

interface JoinedFriendsListProps {
    friendsEmail: string[];
    creatorEmail: string;
    updateJoinedUsers: (joinedUsers: string[]) => void;
}

const JoinedFriendsList: React.FC<JoinedFriendsListProps> = ({ friendsEmail, creatorEmail, updateJoinedUsers }) => {
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
            updateJoinedUsers([...friendsEmail, ...selected]);
            setSelected([]);
            closeModal();
        } catch (e) {
            setError("Failed to add friends to room");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFriend = async (email: string) => {
        if (!roomId) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await removeFriendsFromRoom({ roomId, friends: [email] });
            setSuccess("Friend removed from room!");
            updateJoinedUsers(friendsEmail.filter((u) => u !== email));
            setSelected([]);
            closeModal();
        } catch (e) {
            setError("Failed to remove friend from room");
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
        <div className="flex flex-col h-full bg-background-card rounded-card border border-border-light">
            <div className="p-4 border-b border-border-light">
                <h2 className="text-lg font-semibold text-text-primary">Joined Friends</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ maxHeight: "calc(100vh - 16rem)" }}>
                {[creatorEmail, ...friendsEmail].map((email) => (
                    <div
                        key={email}
                        className="flex items-center gap-2 p-2 rounded-button hover:bg-background-tertiary transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center">
                            <FiUser className="text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-text-primary truncate">{email.split("@")[0]}</div>
                            <div className="text-xs text-text-tertiary truncate">{email}</div>
                        </div>
                        {email === creatorEmail ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-button-primary-background text-button-primary-text">
                                Host
                            </span>
                        ) : creatorEmail === user?.email ? (
                            <button
                                className="text-xs px-2 py-1 rounded-full bg-button-primary-background text-button-primary-text"
                                onClick={() => handleRemoveFriend(email)}
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-button-primary-background text-button-primary-text">
                                Joined
                            </span>
                        )}
                    </div>
                ))}
            </div>
            {creatorEmail === user?.email && (
                <div className="p-4 border-t border-border-light">
                    <button
                        className="w-full py-2 bg-button-primary-background text-button-primary-text rounded-button hover:bg-button-primary-hover transition-colors font-semibold"
                        type="button"
                        onClick={openModal}
                    >
                        Add Friend
                    </button>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-background-card rounded-card p-6 w-full max-w-md shadow-card relative">
                        <button
                            className="absolute top-2 right-2 text-text-tertiary hover:text-text-primary"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-4 text-text-primary">Add Friends to Room</h2>
                        {loading && <div className="text-center text-button-primary-background">Loading...</div>}
                        {error && <div className="text-center text-status-error mb-2">{error}</div>}
                        {success && <div className="text-center text-status-success mb-2">{success}</div>}
                        <div className="max-h-60 overflow-y-auto mb-4">
                            {mappedFriends.length === 0 && !loading && (
                                <div className="text-text-tertiary text-center">No friends found</div>
                            )}
                            {mappedFriends.map((f) => (
                                <label key={f.username} className="flex items-center gap-2 py-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(f.username)}
                                        onChange={() => handleSelect(f.username)}
                                        className="accent-button-primary-background"
                                    />
                                    <span className="font-medium text-text-primary">{f.name}</span>
                                    <span className="text-xs text-text-tertiary">{f.username}</span>
                                </label>
                            ))}
                        </div>

                        <button
                            className="w-full py-2 bg-button-primary-background text-button-primary-text rounded-button hover:bg-button-primary-hover transition-colors font-semibold disabled:opacity-50"
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
