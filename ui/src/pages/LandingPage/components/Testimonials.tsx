import React from "react";

const testimonials = [
    {
        initials: "S&M",
        name: "Sarah & Mike",
        location: "New York, NY",
        quote: "Streamer has completely transformed our long-distance relationship. We have movie nights every Friday, and it feels like we're right next to each other!",
    },
    {
        initials: "E&J",
        name: "Emma & Jake",
        location: "Los Angeles, CA",
        quote: "The synchronized viewing is flawless. We can pause, rewind, and chat without missing a beat. It's like having our own private cinema!",
    },
    {
        initials: "L&D",
        name: "Lisa & David",
        location: "Chicago, IL",
        quote: "Even living together, we love using Streamer. The shared playlists and recommendations have introduced us to so many amazing shows and movies.",
    },
    {
        initials: "M&C",
        name: "Maya & Chris",
        location: "Austin, TX",
        quote: "The private chat feature during movies is adorable. We can share reactions and inside jokes without disturbing anyone. Perfect for date nights!",
    },
];

const Stars = () => (
    <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
        ))}
    </div>
);

export const Testimonials: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#4A4458] mb-2">
                    Love Stories in <span className="text-accent-pink">Action</span>
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    See how couples around the world are using Streamer to strengthen their bonds and create
                    unforgettable memories.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between h-full relative"
                    >
                        <Stars />
                        <blockquote className="text-gray-700 italic mb-6">“{t.quote}”</blockquote>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="w-12 h-12 rounded-full bg-[#4A4458] flex items-center justify-center text-white font-bold text-lg">
                                {t.initials}
                            </div>
                            <div>
                                <div className="font-semibold text-[#4A4458]">{t.name}</div>
                                <div className="text-gray-400 text-sm">{t.location}</div>
                            </div>
                        </div>
                        <svg
                            className="absolute top-6 right-6 w-8 h-8 text-accent-pink opacity-10"
                            fill="none"
                            viewBox="0 0 32 32"
                        >
                            <path
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
