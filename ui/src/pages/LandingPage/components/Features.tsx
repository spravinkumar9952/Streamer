import React from "react";

const features = [
    {
        title: "Watch Together",
        description: "Synchronize video playback with your partner in real-time, no matter the distance.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
            </svg>
        ),
    },
    {
        title: "Chat While Watching",
        description: "Share your thoughts and reactions in real-time with the built-in chat feature.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
        ),
    },
    {
        title: "Create Private Rooms",
        description: "Set up private viewing rooms and invite your partner for an intimate experience.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
            </svg>
        ),
    },
];

export const Features: React.FC = () => {
    return (
        <section className="py-20 bg-background-primary">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-text-primary mb-4">Perfect for Couples</h2>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        Experience the joy of watching together, even when you're apart
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-background-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        >
                            <div className="text-button-primary-background mb-6">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">{feature.title}</h3>
                            <p className="text-text-secondary">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
