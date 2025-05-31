import React from "react";
import { UserPlusIcon, SearchIcon, PlayIcon, HeartArrowIcon } from "./svg/HowItWorksIcons";

const steps = [
    {
        icon: <UserPlusIcon className="w-8 h-8 mb-4" />,
        title: "Sign Up Together",
        desc: "Create your couple's account and invite your partner to join your private streaming room.",
        bg: "bg-[#F7A8C1]/10",
    },
    {
        icon: <SearchIcon className="w-8 h-8 mb-4" />,
        title: "Choose Your Content",
        desc: "Browse our vast library or upload your own videos. Create shared playlists and wishlists.",
        bg: "bg-[#F7E6A8]/30",
    },
    {
        icon: <PlayIcon className="w-8 h-8 mb-4" />,
        title: "Watch in Sync",
        desc: "Start watching together in perfect synchronization, no matter the distance between you.",
        bg: "bg-[#C6B6F7]/20",
    },
    {
        icon: <HeartArrowIcon className="w-8 h-8 mb-4" />,
        title: "Connect & Enjoy",
        desc: "Chat, react, and share every moment together. Make every viewing session a date night.",
        bg: "bg-[#F7E6A8]/30",
    },
];

export const HowItWorks: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#4A4458] mb-2">
                    How It <span className="text-accent-pink">Works</span>
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Getting started is simple. Follow these easy steps to begin your shared viewing journey.
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto items-stretch justify-center">
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        <div
                            className={`flex-1 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center relative ${step.bg}`}
                        >
                            <div className="absolute -top-4 -left-4 bg-[#4A4458] text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg shadow-md border-4 border-white">
                                {i + 1}
                            </div>
                            {step.icon}
                            <h3 className="text-xl font-semibold text-[#22223B] mb-2 mt-2">{step.title}</h3>
                            <p className="text-gray-500">{step.desc}</p>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="hidden md:flex items-center justify-center">
                                <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M8 16h16m0 0l-4-4m4 4l-4 4"
                                        stroke="#C6B6F7"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    </section>
);
