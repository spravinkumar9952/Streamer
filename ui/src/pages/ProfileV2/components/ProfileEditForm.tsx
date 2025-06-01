import React, { useState } from "react";
import { getProfile, ProfileResp, updateProfile, updateUserProfile } from "../../../api/profile";

interface ProfileEditFormProps {
    user: ProfileResp | null;
    setUser: (user: ProfileResp) => void;
    setEditMode: (edit: boolean) => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, setUser, setEditMode }) => {
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        username: user?.email ? `@${user.email.split("@")[0]}` : "",
        location: user?.location || "",
        bio: user?.bio || "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null); // Clear error when user makes changes
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Call updateProfile API
            await updateUserProfile({ location: form.location, bio: form.bio });
            const updatedUser = await getProfile();
            // Update local state
            setUser(updatedUser);
            setEditMode(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/80 rounded-2xl shadow p-8 mt-8">
            <div className="flex items-center gap-2 mb-6">
                <svg
                    className="w-6 h-6 text-accent-pink"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path d="M9 2h6v4H9z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-lg font-semibold text-[#4A4458]">Edit Profile Information</span>
            </div>

            {error && <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-[#A084CA] text-sm font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-[#F7A8C1]/30 bg-white text-[#4A4458] focus:outline-none focus:ring-2 focus:ring-accent-pink"
                    />
                </div>
                <div>
                    <label className="block text-[#A084CA] text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-[#F7A8C1]/30 bg-gray-100 text-[#4A4458] cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-[#A084CA] text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-[#F7A8C1]/30 bg-gray-100 text-[#4A4458] cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-[#A084CA] text-sm font-medium mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-[#F7A8C1]/30 bg-white text-[#4A4458] focus:outline-none focus:ring-2 focus:ring-accent-pink"
                    />
                </div>
            </div>
            <div className="mb-6">
                <label className="block text-[#A084CA] text-sm font-medium mb-1">Bio</label>
                <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-[#F7A8C1]/30 bg-white text-[#4A4458] focus:outline-none focus:ring-2 focus:ring-accent-pink"
                />
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#F7A8C1] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    disabled={saving}
                    className="px-6 py-2 rounded-full font-semibold text-[#F7A8C1] bg-white border-2 border-[#F7A8C1]/40 hover:bg-accent-pink/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProfileEditForm;
