


import React, { useEffect } from 'react';
import { FC, useState } from 'react';
import { Friend, FriendsListResp } from '../api/profile';

interface CreateStreamingPropsType {

};

const CreateStreaming: FC<CreateStreamingPropsType> = ({ }) => {
  const [name, setName] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendsListResp | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<Friend | null>(null);

  useEffect(() => {
    setFriends(friends);
  }, [])

  const onRoomNameChange = async (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  }

  const handleOnSelectFriends = (event: React.FormEvent<HTMLSelectElement>) => {
    console.log("Event", event);
  }

  return (
    <div>
      <h5>Create streaming room</h5>

      <input onChange={onRoomNameChange} placeholder={"Room name"} />

      <select id="friends" name="friends" onSelect={handleOnSelectFriends}>
        {friends && friends.friends.map(item => <option value={item.email}>{item.name}</option>)}
      </select>
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