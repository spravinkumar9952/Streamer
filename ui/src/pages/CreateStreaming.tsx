import React, { useEffect } from "react";
import { FC, useState } from "react";
import { Friend, FriendsListResp, getFriendsList } from "../api/profile";
import NavBar from "../components/NavBar";
import { createStreamingRoom } from "../api/streamingRoom";
import { useNavigate, useNavigation } from "react-router-dom";

interface CreateStreamingPropsType {}

const CreateStreaming: FC<CreateStreamingPropsType> = ({}) => {
  const [name, setName] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendsListResp | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const navigation = useNavigate();

  useEffect(() => {
    const updateFriendsList = async () => {
      const resp = await getFriendsList();
      console.log(resp);
      setFriends(resp);
    };
    updateFriendsList();
  }, []);

  const onRoomNameChange = async (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const handleOnSelectFriends = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedFriends((oldSelectedFriends) => [
      ...oldSelectedFriends,
      event.target.value,
    ]);
  };
  console.log("Friends", friends);

  const onCreateRoomClick = () => {
    if (name === null) {
      return;
    }
    createStreamingRoom({ roomName: name, friends: selectedFriends }).then(
      (resp) => {
        if (resp.id) {
          navigation("/home");
        }
      }
    );
  };

  return (
    <div>
      <NavBar />
      <h5>Create streaming room</h5>

      <input
        onChange={onRoomNameChange}
        placeholder={"Room name"}
        className="px-4 my-4 shadow-md"
      />

      <div className="flex flex-col justify-center items-center">
        <text>Select friends</text>
        {friends &&
          friends.friends.map((item) => (
            <label key={item.email} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={item.email}
                checked={selectedFriends?.includes(item.email)}
                onChange={handleOnSelectFriends}
                className="w-5 h-5 "
              />
              <span>{item.name}</span>
              <span className="text-green-600">({item.email})</span>{" "}
            </label>
          ))}
      </div>

      <button onClick={onCreateRoomClick}> Create Room</button>
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
