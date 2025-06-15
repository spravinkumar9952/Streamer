import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/Auth";
import Cookies from "js-cookie";

export const LogOut: FC = () => {
    const navigate = useNavigate();

    const { setUser } = useAuth();

    const onLogout = () => {
        Cookies.remove("authToken");
        setUser(null);
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
    };

    return (
        <div className="flex flex-col gap-2">
            <button className="text-red-500" onClick={onLogout}>
                Logout
            </button>
        </div>
    );
};
