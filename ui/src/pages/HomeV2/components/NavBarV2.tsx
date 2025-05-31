import React from "react";
import { useNavigate } from "react-router-dom";

export const NavBarV2: React.FC = () => {
    const navigate = useNavigate();
    return (
        <nav className="sticky top-0 z-30 w-full bg-[#4A4458] shadow-lg py-3 px-6 flex items-center justify-between rounded-b-2xl">
            <div className="flex items-center gap-3">
                <img src="/png/ic_logo.png" alt="Streamer Logo" className="w-8 h-8 object-contain" />
                <span className="text-2xl font-bold text-white">Streamer</span>
            </div>
            <div className="flex-1 flex justify-center">
                <div className="w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Search for friends..."
                        className="w-full px-5 py-2 rounded-full border border-border-light bg-background-tertiary text-white focus:outline-none focus:ring-2 focus:ring-accent-pink placeholder:text-gray-300"
                    />
                </div>
            </div>
            <div className="flex items-center gap-5">
                <button
                    className="px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#A084CA] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#A084CA] transition"
                    onClick={() => navigate("/createStreaming")}
                >
                    Create Room
                </button>
                {/* Notification Icon */}
                <button className="relative">
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                </button>
                {/* Settings Icon */}
                <button>
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-4h-4m-8 0H4"
                        />
                    </svg>
                </button>
                {/* Profile Icon */}
                <button>
                    <div className="w-8 h-8 rounded-full bg-accent-pink/30 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-white"
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
    );
};

export default NavBarV2;
