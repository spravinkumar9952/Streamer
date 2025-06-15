import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/profile";
import Cookies from "js-cookie";

interface User {
    email: string;
    name: string;
    picture: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const token = Cookies.get("authToken");
            if (token) {
                try {
                    const profile = await getProfile();
                    setUser({
                        email: profile.email,
                        name: profile.name,
                        picture: profile.picture || "",
                    });
                } catch (error) {
                    // Token is invalid or expired
                    Cookies.remove("authToken");
                    setUser(null);
                    navigate("/login", { replace: true });
                }
            }
        };

        validateToken();
    }, [navigate]);

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
