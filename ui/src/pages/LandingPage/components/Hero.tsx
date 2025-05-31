import React from "react";
import { Heart } from "./svg/Heart";
import { authGoogle } from "../../../api/auth";

export const Hero: React.FC = () => {
    const handleGoogleLogin = () => {
        console.log("handleGoogleLogin process.env.HTTP_SERVER_URL", process.env.HTTP_SERVER_URL);
        authGoogle();
    };
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#4A4458] to-[#6B5C7D] overflow-hidden">
            {/* Decorative icons */}
            <div className="absolute top-8 left-8 opacity-10">
                <Heart className="w-10 h-10" />
            </div>
            <div className="absolute bottom-8 right-8 opacity-10">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-accent-pink">
                    <path
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {/* Couple SVG decorative element */}
            <div className="absolute top-1/2 left-4 opacity-10 -translate-y-1/2">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="16" cy="20" r="6" fill="#F7A8C1" fillOpacity="0.5" />
                    <circle cx="32" cy="20" r="6" fill="#F7A8C1" fillOpacity="0.5" />
                    <rect x="12" y="28" width="24" height="12" rx="6" fill="#F7A8C1" fillOpacity="0.3" />
                </svg>
            </div>
            {/* Main content */}
            <div className="container mx-auto px-4 py-16 flex-1 flex flex-col justify-center items-center relative z-10">
                <div className="max-w-2xl w-full text-center mx-auto">
                    <div className="flex justify-center mb-4">
                        <img src="/png/ic_logo.png" alt="Streamer Logo" className="w-20 h-20 object-contain" />
                    </div>
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-6xl font-extrabold text-white leading-tight">Streamer</h1>
                        <div className="w-16 h-1 bg-accent-pink rounded-full mt-3 mb-2" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Watch Together,
                        <br />
                        <span className="text-accent-pink">Love Deeper</span>
                    </h2>
                    <p className="text-lg text-white/80 mb-10">
                        The perfect streaming platform for couples to enjoy movies, shows, and special moments together,
                        no matter where you are.
                    </p>
                    {/* Card for Google login */}
                    <div className="mx-auto w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-10 border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-2">Start Your Journey</h3>
                        <p className="text-white/70 mb-6">Join thousands of couples already watching together</p>
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-2 bg-white text-[#4A4458] font-medium py-3 rounded-full shadow hover:bg-gray-100 transition"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21.805 10.023h-9.765v3.954h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.125s2.75-6.125 6.125-6.125c1.922 0 3.211.82 3.953 1.523l2.703-2.703c-1.703-1.57-3.898-2.547-6.656-2.547-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.016 9.547-9.664 0-.648-.07-1.148-.156-1.586z" />
                            </svg>
                            Continue with Google
                        </button>
                        <p className="text-xs text-white/60 mt-4">No credit card required · Free to start</p>
                    </div>
                </div>
            </div>
            {/* Soft white overlay at the bottom */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
        </div>
    );
};
