import React from "react";

export type RoomCardProps = {
    title: string;
    subtitle: string;
    status: "Live" | "Offline";
    viewers: number;
    avatars: { initials: string; color: string }[];
    onJoin: () => void;
    thumbnail?: string | null;
    videoTitle?: string;
    videoChannel?: string;
    videoDescription?: string;
    createdBy?: string;
};

export const RoomCard: React.FC<RoomCardProps> = ({
    title,
    subtitle,
    status,
    viewers,
    avatars,
    onJoin,
    thumbnail,
    createdBy,
}) => {
    return (
        <div className="bg-[#3B2A4A] rounded-2xl shadow-lg overflow-hidden flex flex-col transform transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <div className="relative flex-1 flex flex-col items-center justify-center min-h-[180px] bg-gradient-to-br from-[#A084CA]/20 to-[#C6B6F7]/10">
                {/* Status badge */}
                <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        status === "Live" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"
                    }`}
                >
                    {status}
                </span>
                {/* Viewers badge */}
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#A084CA]/10 text-[#A084CA]">
                    {viewers} viewers
                </span>
                {/* Thumbnail or Video icon */}
                {thumbnail ? (
                    <>
                        <img
                            src={thumbnail}
                            alt="Video thumbnail"
                            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                        <svg
                            className="w-16 h-16 text-white relative z-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 32 32"
                        >
                            <rect x="6" y="10" width="14" height="12" rx="4" stroke="white" strokeWidth="2" />
                            <polygon points="22,14 26,16 22,18" fill="#C6B6F7" fillOpacity="0.7" />
                        </svg>
                    </>
                ) : (
                    <svg
                        className="w-16 h-16 text-[#C6B6F7]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 32 32"
                    >
                        <rect x="6" y="10" width="14" height="12" rx="4" stroke="#C6B6F7" strokeWidth="2" />
                        <polygon points="22,14 26,16 22,18" fill="#C6B6F7" fillOpacity="0.7" />
                    </svg>
                )}
            </div>
            <div className="bg-[#4A3A5A] p-6 flex flex-col gap-3">
                {/* Room Name */}
                <div className="font-semibold text-lg text-gray-100 mb-1">{title}</div>
                {/* Creator */}
                {createdBy && (
                    <div className="text-xs text-[#E7B6C7] mb-1">
                        Hosted by <span className="font-medium text-[#F7A8C1]">{createdBy}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                    {avatars.map((a, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: a.color }}
                        >
                            {a.initials}
                        </div>
                    ))}
                </div>
                <button
                    onClick={onJoin}
                    className="w-full py-2 rounded-full font-semibold text-gray-100 bg-gradient-to-r from-[#A084CA] to-[#C6B6F7] shadow transition hover:from-[#C6B6F7] hover:to-[#A084CA]"
                >
                    Join Room
                </button>
            </div>
        </div>
    );
};
