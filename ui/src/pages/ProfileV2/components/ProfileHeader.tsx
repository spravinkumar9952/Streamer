import React from "react";
import { ProfileResp } from "../../../api/profile";
import CameraIcon from "../svg/CameraIcon";

interface ProfileHeaderProps {
    user: ProfileResp | null;
    editMode: boolean;
    setEditMode: (edit: boolean) => void;
    isAlien: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, editMode, setEditMode, isAlien }) => {
    return (
        <div className="relative rounded-3xl mb-8 bg-gradient-to-r from-[#A084CA]/60 to-[#FFD3B6]/60 shadow-lg px-4 py-6 md:px-10 md:py-10 flex flex-col md:flex-row items-center md:items-center text-center md:text-left">
            {/* Edit button (desktop only) */}
            <div className="absolute right-4 top-4 md:right-8 md:top-6 z-10 hidden md:block">
                {!editMode && !isAlien && (
                    <button
                        className="px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#F7A8C1] transition"
                        onClick={() => setEditMode(true)}
                    >
                        Edit Profile
                    </button>
                )}
                {editMode && !isAlien && (
                    <button
                        className="px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#F7A8C1] transition"
                        onClick={() => setEditMode(false)}
                    >
                        Cancel
                    </button>
                )}
            </div>
            {/* Avatar on the left (or top on mobile) */}
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-10">
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                    <img
                        src={user?.picture ?? "/png/user.png"}
                        alt="Profile"
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-xl bg-white"
                    />
                    <div className="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer border border-[#F7A8C1]">
                        <CameraIcon className="w-5 h-5 md:w-6 md:h-6 text-accent-pink" />
                    </div>
                </div>
            </div>
            {/* Info on the right (or below on mobile) */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className="text-3xl font-bold text-white drop-shadow mb-1 truncate">{user?.name}</div>
                <div className="text-lg font-medium text-[#E0D7F7] mb-2 truncate">@{user?.email?.split("@")[0]}</div>
                <div className="mb-2 text-base text-[#FFF6F6] break-words">
                    {user?.bio || <span className="italic text-[#E0D7F7]">No bio yet</span>}
                </div>
                <div className="text-sm text-[#FFD3B6] flex items-center gap-2 justify-center md:justify-start">
                    <span>📍 {user?.location || "Location not set"}</span>
                </div>
            </div>
            {/* Edit button (mobile only) */}
            {!isAlien && (
                <div className="mt-4 w-full block md:hidden">
                    {!editMode ? (
                        <button
                            className="w-full px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#F7A8C1] transition"
                            onClick={() => setEditMode(true)}
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            className="w-full px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#F7A8C1] transition"
                            onClick={() => setEditMode(false)}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;
