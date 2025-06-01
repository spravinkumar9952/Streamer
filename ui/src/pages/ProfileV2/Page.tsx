import React, { useEffect, useState, useContext } from "react";
import { getProfile, getUserByEmail, ProfileResp } from "../../api/profile";
import { useLocation } from "react-router-dom";
import AuthContext from "../../contexts/Auth";
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileEditForm from "./components/ProfileEditForm";
import ProfileNavBar from "./components/ProfileNavBar";

const ProfileV2: React.FC = () => {
    const [user, setUser] = useState<ProfileResp | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const location = useLocation();
    const { user: authUser } = useContext(AuthContext);
    const data: ProfileResp | undefined = location.state;

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const profileResp = data && data.email ? await getUserByEmail(data.email) : await getProfile();
                setUser(profileResp);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [data, data?.email]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background-primary">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background-primary">
            <ProfileNavBar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <ProfileHeader user={user} editMode={editMode} setEditMode={setEditMode} />
                    <ProfileStats user={user} />
                    {editMode && <ProfileEditForm user={user} setUser={setUser} setEditMode={setEditMode} />}
                </div>
            </div>
        </div>
    );
};

export default ProfileV2;
