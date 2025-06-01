import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileNavBar: React.FC = () => {
    const navigate = useNavigate();
    const onLogoClick = () => {
        navigate("/");
    };
    return (
        <nav className="sticky top-0 z-30 w-full bg-[#4A4458] shadow-lg py-3 px-6 flex items-center justify-between rounded-b-2xl">
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
                <img src="/png/ic_logo.png" alt="Streamer Logo" className="w-8 h-8 object-contain" />
                <span className="text-2xl font-bold text-white cursor-pointer">Streamer</span>
            </div>
            {/* Right: Settings Icon */}
            <button className="p-2 rounded-full hover:bg-white/10 transition">
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
        </nav>
    );
};

export default ProfileNavBar;
