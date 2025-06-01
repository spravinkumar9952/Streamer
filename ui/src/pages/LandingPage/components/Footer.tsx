import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-background-secondary py-12 relative">
            {/* Couple SVG decorative element */}
            <div className="absolute top-4 right-8 opacity-10">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path
                        d="M24 44s-14-8.35-14-20A8 8 0 0 1 24 12a8 8 0 0 1 14 12c0 11.65-14 20-14 20z"
                        fill="#F7A8C1"
                        fillOpacity="0.4"
                    />
                    <path d="M34 18a6 6 0 1 0-12 0c0 6.627 6 12 6 12s6-5.373 6-12z" fill="#F7A8C1" fillOpacity="0.6" />
                </svg>
            </div>
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-4">
                            <div className="flex items-center mb-4 justify-center">
                                <img src="/png/ic_logo.png" alt="Streamer Logo" className="w-10 h-10 object-contain" />
                                <span className="ml-2 text-2xl font-bold text-text-primary">Streamer</span>
                            </div>
                            <p className="text-text-secondary mb-4">
                                Bringing couples closer through shared video experiences.
                            </p>
                        </div>

                        {/* <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-text-secondary hover:text-button-primary-background transition-colors"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-text-secondary hover:text-button-primary-background transition-colors"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-text-secondary hover:text-button-primary-background transition-colors"
                                    >
                                        About
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-text-secondary hover:text-button-primary-background transition-colors"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-text-secondary hover:text-button-primary-background transition-colors"
                                    >
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-text-secondary hover:text-button-primary-background transition-colors"
                                    >
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div> */}
                    </div>

                    <div className="border-t border-border-light mt-12 pt-8 text-center text-text-secondary">
                        <p>&copy; {new Date().getFullYear()} Streamer. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
