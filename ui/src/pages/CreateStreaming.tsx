import React, { useEffect } from "react";
import { FC, useState } from "react";
import { Friend, FriendsListResp, getFriendsList } from "../api/profile";
import NavBar from "../components/NavBar";
import { createStreamingRoom } from "../api/streamingRoom";
import { useNavigate } from "react-router-dom";

interface CreateStreamingPropsType {}

const CreateStreaming: FC<CreateStreamingPropsType> = ({}) => {
  const [name, setName] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendsListResp | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigate();

  useEffect(() => {
    const updateFriendsList = async () => {
      const resp = await getFriendsList();
      setFriends(resp);
    };
    updateFriendsList();
  }, []);

  const onRoomNameChange = async (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const handleOnSelectFriends = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setSelectedFriends((oldSelectedFriends) => {
      if (oldSelectedFriends.includes(email)) {
        return oldSelectedFriends.filter(friend => friend !== email);
      }
      return [...oldSelectedFriends, email];
    });
  };

  const onVideoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const checkIsYoutubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const onCreateRoomClick = () => {
    if (!name || !videoUrl) {
      setError("Please enter a room name and video URL");
      return;
    }

    if (!checkIsYoutubeUrl(videoUrl)) {
      setError("Please enter a valid YouTube URL");
      return;
    }


    createStreamingRoom({ roomName: name, friends: selectedFriends, videoUrl: videoUrl}).then(
      (resp) => {
        if (resp.id) {
          navigation("/home");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Create Streaming Room</h1>
            <p className="text-text-secondary">Invite friends to watch together</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-text-primary mb-2">
                Room Name
              </label>
              <input
                id="roomName"
                onChange={onRoomNameChange}
                placeholder="Enter room name"
                className="w-full px-4 py-3 bg-background-card border border-border-light rounded-button text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-medium text-text-primary">Select Friends</h2>
              <div className="space-y-3">
                {friends?.friends.map((item) => (
                  <label
                    key={item.email}
                    className="flex items-center space-x-4 p-3 bg-background-card rounded-card hover:bg-background-secondary transition-colors duration-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={item.email}
                      checked={selectedFriends.includes(item.email)}
                      onChange={handleOnSelectFriends}
                      className="w-5 h-5 rounded border-border-light text-secondary focus:ring-secondary"
                    />
                    <div className="flex items-center space-x-3">
                      <img
                        src="/png/users.png"
                        alt={item.name}
                        className="w-10 h-10 rounded-full border-2 border-border-light"
                      />
                      <div>
                        <span className="block text-text-primary font-medium">{item.name}</span>
                        <span className="block text-sm text-text-tertiary">{item.email}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-text-primary mb-2">
                Video URL
              </label>
              <input
                id="videoUrl"
                onChange={onVideoUrlChange}
                placeholder="Enter video URL"
                className="w-full px-4 py-3 bg-background-card border border-border-light rounded-button text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="pt-6">
              <button
                onClick={onCreateRoomClick}
                disabled={!name || !videoUrl}
                className={`w-full py-3 px-6 rounded-button font-medium transition-all duration-200 ${
                  name && videoUrl
                    ? "bg-button-primary-background hover:bg-button-primary-hover text-button-primary-text transform hover:scale-[1.02]"
                    : "bg-background-card text-text-tertiary cursor-not-allowed"
                }`}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStreaming;

/**
 *
 * Needs
 *
 * name, friends,
 */
