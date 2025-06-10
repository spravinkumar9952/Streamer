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
        <div className="w-full max-w-xs bg-[#232323] rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <div className="relative aspect-video bg-[#111]">
                {thumbnail ? (
                    <img src={thumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-[#C6B6F7]">🎬</div>
                )}
                <span
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold ${
                        status === "Live" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-200"
                    }`}
                >
                    {status}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs bg-black/60 text-white">
                    {viewers} viewers
                </span>
            </div>
            <div className="p-3 flex flex-col gap-1">
                <div className="font-semibold text-base text-white truncate">{title}</div>
                {createdBy && <div className="text-xs text-gray-400 truncate">by {createdBy}</div>}
                <div className="flex items-center gap-1 mt-1">
                    {avatars.slice(0, 3).map((a, i) => (
                        <div
                            key={i}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: a.color, color: "#fff" }}
                        >
                            {a.initials}
                        </div>
                    ))}
                    {avatars.length > 3 && <span className="text-xs text-gray-400">+{avatars.length - 3}</span>}
                </div>
                <button
                    onClick={onJoin}
                    className="mt-2 w-full py-1 rounded bg-[#A084CA] text-white text-sm font-semibold hover:bg-[#C6B6F7] transition"
                >
                    Join
                </button>
            </div>
        </div>
    );
};
