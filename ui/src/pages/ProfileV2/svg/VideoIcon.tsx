import React from "react";
const VideoIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="7" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="17,10 21,12 17,14" fill="currentColor" />
    </svg>
);
export default VideoIcon;
