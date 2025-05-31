import React from "react";

const FriendsIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="10" r="4" stroke="#F7A8C1" strokeWidth="2" />
        <rect x="6" y="16" width="12" height="4" rx="2" fill="#F7A8C1" fillOpacity="0.3" />
    </svg>
);

export default FriendsIcon;
