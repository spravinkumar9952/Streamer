import React from "react";

export const UserPlusIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="13" r="6" fill="#F7A8C1" fillOpacity="0.5" />
        <rect x="6" y="22" width="20" height="6" rx="3" fill="#F7A8C1" fillOpacity="0.3" />
        <rect x="22" y="8" width="2" height="8" rx="1" fill="#F7A8C1" />
        <rect x="19" y="11" width="8" height="2" rx="1" fill="#F7A8C1" />
    </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="15" cy="15" r="8" fill="#F7E6A8" fillOpacity="0.7" />
        <rect x="22" y="22" width="8" height="2" rx="1" transform="rotate(45 22 22)" fill="#F7E6A8" />
    </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="16" rx="6" fill="#C6B6F7" fillOpacity="0.5" />
        <polygon points="14,12 22,16 14,20" fill="#C6B6F7" fillOpacity="0.7" />
    </svg>
);

export const HeartArrowIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 28s-10-6-10-14a6 6 0 0 1 12 0 6 6 0 0 1 12 0c0 8-10 14-10 14z" fill="#F7D6A8" fillOpacity="0.7" />
        <path d="M16 20l4 4M16 20l-4 4" stroke="#F7A8C1" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
