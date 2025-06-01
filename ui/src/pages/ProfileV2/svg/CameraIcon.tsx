import React from "react";

const CameraIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

export default CameraIcon;
