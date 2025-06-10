import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../../contexts/Auth";
import { FiUserPlus, FiUser } from "react-icons/fi";
import { getFriendsList, Friend } from "../../../api/profile";
import { addFriendsToRoom } from "../../../api/streamingRoom";

interface StreamingNavBarProps {
    joinedUsers: string[];
}

const StreamingNavBar: React.FC<StreamingNavBarProps> = ({ joinedUsers }) => {
    const navigate = useNavigate();
    const { user: authUser } = useContext(AuthContext);
    const { roomId } = useParams<{ roomId: string }>();
    const [showFriendsModal, setShowFriendsModal] = useState(false);
    const [allFriends, setAllFriends] = useState<Friend[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (showFriendsModal) {
            setLoading(true);
            getFriendsList()
                .then((resp) => setAllFriends(resp.friends))
                .catch(() => setError("Failed to fetch friends"))
                .finally(() => setLoading(false));
        }
    }, [showFriendsModal]);

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
            setTimeout(() => setShowFriendsModal(false), 1000);
        } catch (e) {
            setError("Failed to add friends to room");
        } finally {
            setLoading(false);
        }
    };

    // Use the real joined users list from props
    const joinedSet = new Set(joinedUsers);
    const mappedFriends = allFriends.filter((f) => f.email !== authUser?.email && !joinedSet.has(f.email));

    const onProfileClick = () => {
        navigate("/profile", { state: { email: authUser?.email } });
    };

    return (
        <>
            <nav className="sticky top-0 z-30 w-full bg-background-primary shadow-lg py-2 px-2 md:py-3 md:px-6 flex items-center justify-between rounded-b-2xl">
                {/* Logo and Brand */}
                <div className="flex items-center gap-2 md:gap-3">
                    <img src="/png/ic_logo.png" alt="Streamer Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                    <span className="text-lg md:text-2xl font-bold text-text-primary">Streamer</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-5">
                    {/* Person+ icon for mobile only */}
                    <button
                        className="block md:hidden p-2 rounded-full hover:bg-background-tertiary transition-colors"
                        onClick={() => setShowFriendsModal(true)}
                        aria-label="Show Friends"
                    >
                        <FiUserPlus className="w-6 h-6 text-text-tertiary" />
                    </button>
                    {/* Profile Icon */}
                    <button onClick={onProfileClick}>
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-button-primary-background flex items-center justify-center">
                            <svg
                                className="w-5 h-5 md:w-6 md:h-6 text-button-primary-text"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
                                />
                            </svg>
                        </div>
                    </button>
                </div>
            </nav>
            {/* Friends Modal (mobile only) */}
            {showFriendsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-background-card rounded-card p-6 w-full max-w-xs mx-2 relative">
                        <button
                            className="absolute top-2 right-2 text-text-tertiary hover:text-text-primary text-2xl"
                            onClick={() => setShowFriendsModal(false)}
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
                                <label key={f.email} className="flex items-center gap-2 py-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(f.email)}
                                        onChange={() => handleSelect(f.email)}
                                        className="accent-button-primary-background"
                                    />
                                    <span className="font-medium text-text-primary">{f.name}</span>
                                    <span className="text-xs text-text-tertiary">{f.email}</span>
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
        </>
    );
};

export default StreamingNavBar;
