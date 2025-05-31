import React from "react";

export const VideoIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="18" height="16" rx="4" fill="#F7A8C1" fillOpacity="0.5" />
        <polygon points="24,14 28,16 24,18" fill="#F7A8C1" fillOpacity="0.7" />
    </svg>
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="14" rx="5" fill="#F7D6A8" fillOpacity="0.5" />
        <ellipse cx="10" cy="15" rx="2" ry="2" fill="#F7D6A8" />
        <ellipse cx="16" cy="15" rx="2" ry="2" fill="#F7D6A8" />
        <ellipse cx="22" cy="15" rx="2" ry="2" fill="#F7D6A8" />
    </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="8" width="22" height="18" rx="4" fill="#C6B6F7" fillOpacity="0.5" />
        <rect x="9" y="14" width="6" height="6" rx="2" fill="#C6B6F7" />
    </svg>
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 28s-10-6-10-14a6 6 0 0 1 12 0 6 6 0 0 1 12 0c0 8-10 14-10 14z" fill="#F7E6A8" fillOpacity="0.7" />
    </svg>
);

export const LockIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="8" y="14" width="16" height="12" rx="4" fill="#C6B6F7" fillOpacity="0.5" />
        <rect x="12" y="10" width="8" height="8" rx="4" fill="#C6B6F7" />
    </svg>
);

export const DeviceIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="8" width="20" height="16" rx="3" fill="#F7D6A8" fillOpacity="0.5" />
        <rect x="14" y="22" width="4" height="2" rx="1" fill="#F7D6A8" />
    </svg>
);
