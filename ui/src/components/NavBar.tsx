import React, { FC, useState } from "react";
import { Friend, getProfile, getSearchResult, ProfileResp } from "../api/profile";
import { useNavigate } from "react-router-dom";

type NavBarProps = {
    showSearch?: boolean;
};

const NavBar: FC<NavBarProps> = ({ showSearch  }) => {
    const navigation = useNavigate();
    const [users, setUsers] = useState<ProfileResp[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const onProfileClick = async () => {
        navigation("/profile");
    };

    const onLogoClick = async () => {
        navigation("/home");
    };

    const onSearchTextChange = async (event: React.FormEvent<HTMLInputElement>) => {
        const resp = await getSearchResult(event.currentTarget.value);
        setUsers(resp.list);
    };

    return (
        <>
            <div className="w-screen bg-background-primary border-b border-border-light flex flex-row justify-between items-center px-6 py-3 shadow-lg">
                <h1
                    className="font-bold text-2xl text-text-primary hover:text-secondary-light cursor-pointer transition-colors duration-200"
                    onClick={onLogoClick}
                >
                    STREAMER
                </h1>
                <div className="flex flex-row items-center space-x-4">
                    {showSearch && (
                        <div className="relative">
                            <input
                                onChange={onSearchTextChange}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            className="w-64 h-10 px-4 py-2 bg-background-card text-text-primary placeholder-text-tertiary rounded-button focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background-primary transition-all duration-200"
                            placeholder="Search users..."
                        />
                        <svg
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    )}
                    <button
                        onClick={onProfileClick}
                        className="relative group"
                    >
                        <img
                            src="/png/user.png"
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-border-light hover:border-secondary transition-colors duration-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-status-online rounded-full border-2 border-background-primary"></div>
                    </button>
                </div>
            </div>

            {isSearchFocused && users.length > 0 && (
                <div className="absolute z-50 w-64 mt-1 bg-background-card border border-border-light rounded-card shadow-card right-6 animate-fade-in">
                    {users.map((item, index) => (
                        <SearchItem
                            key={item.email}
                            name={item.name}
                            email={item.email}
                            isLast={index === users.length - 1}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

type SearchItemProps = {
    name: string;
    email: string;
    isLast: boolean;
};

const SearchItem: FC<SearchItemProps> = ({ name, email, isLast }) => {
    const navigation = useNavigate();
    const onSearchItemClick = () => {
        navigation("/profile", { state: { email: email } });
    };

    return (
        <button
            onClick={onSearchItemClick}
            className={`w-full flex items-center space-x-3 p-3 hover:bg-background-secondary transition-colors duration-200 ${!isLast ? 'border-b border-border-light' : ''}`}
        >
            <img
                src="/png/user.png"
                alt="User"
                className="w-8 h-8 rounded-full border border-border-light"
            />
            <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-text-primary">{name}</span>
                <span className="text-xs text-text-tertiary">{email}</span>
            </div>
        </button>
    );
};

export default NavBar;
