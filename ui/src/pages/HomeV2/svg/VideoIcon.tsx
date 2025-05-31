import React from "react";

const VideoIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="10" rx="4" stroke="#F7A8C1" strokeWidth="2" />
        <rect x="9" y="10" width="6" height="4" rx="2" fill="#F7A8C1" fillOpacity="0.3" />
    </svg>
);

export default VideoIcon;
