import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const token = Cookies.get("authToken");
        if (!token || !user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    // Show nothing while checking authentication
    if (!user) {
        return null;
    }

    return <>{children}</>;
};
