import React from "react";
const FriendsIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="8" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 19c0-2.5 3.5-4.5 6-4.5s6 2 6 4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 19c0-1.5 2-2.5 4-2.5s4 1 4 2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);
export default FriendsIcon;
