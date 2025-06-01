import React from "react";
import { VideoIcon, ChatIcon, CalendarIcon, HeartIcon, LockIcon, DeviceIcon } from "./svg/FeatureIcons";

const features = [
    {
        icon: <VideoIcon className="w-8 h-8 mb-4" />,
        title: "Synchronized Viewing",
        desc: "Watch movies and shows in perfect sync, with automatic pause and play for both partners.",
    },
    // {
    //     icon: <ChatIcon className="w-8 h-8 mb-4" />,
    //     title: "Live Chat & Reactions",
    //     desc: "Share your thoughts and reactions in real-time with private chat and emoji reactions.",
    // },
    // {
    //     icon: <CalendarIcon className="w-8 h-8 mb-4" />,
    //     title: "Date Night Planner",
    //     desc: "Schedule movie nights and get personalized recommendations for your perfect date.",
    // },
    // {
    //     icon: <HeartIcon className="w-8 h-8 mb-4" />,
    //     title: "Couple's Wishlist",
    //     desc: "Create shared watchlists and discover new content you'll both love together.",
    // },
    {
        icon: <LockIcon className="w-8 h-8 mb-4" />,
        title: "Private & Secure",
        desc: "Your viewing sessions are completely private and secure, just for you two.",
    },
    {
        icon: <DeviceIcon className="w-8 h-8 mb-4" />,
        title: "Any Device, Anywhere",
        desc: "Stream on any device – phone, tablet, laptop. Stay connected wherever you are.",
    },
];

export const FeaturesGrid: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#4A4458] mb-2">
                    Made for <span className="text-accent-pink">Love</span>
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Every feature is designed to bring couples closer together through shared entertainment experiences.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition hover:shadow-xl"
                    >
                        {f.icon}
                        <h3 className="text-xl font-semibold text-[#22223B] mb-2">{f.title}</h3>
                        <p className="text-gray-500">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
