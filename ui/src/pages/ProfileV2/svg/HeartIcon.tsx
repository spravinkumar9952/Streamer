import React from "react";
const HeartIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path
            d="M12 21s-6-4.35-8-7.5C2 9.36 4.24 7 7 7c1.54 0 3.04.99 4 2.09C12.96 7.99 14.46 7 16 7c2.76 0 5 2.36 3 6.5C18 16.65 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.15"
        />
    </svg>
);
export default HeartIcon;
