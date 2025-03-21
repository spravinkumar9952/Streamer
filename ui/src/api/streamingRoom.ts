import { baseUrl, getHeaders } from "./common";

interface CreateStreamingRoomReq {
    roomName: string;
    friends: string[];
    videoUrl: string;
}
interface CreateStreamingRoomResp {
    id: string;
}

export const createStreamingRoom = async (req: CreateStreamingRoomReq) => {
    const url = baseUrl + "stream/rooms/create";
    const resp = await fetch(url ?? "", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(req),
    });

    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const apiResp = await resp.json();
    return apiResp as CreateStreamingRoomResp;
};

// -----------------

interface GetStreamingRoomsListReq {}

export interface StreamingRoom {
    id: string;
    created_at: string;
    joinedUsers: string[];
    name: string;
    videoUrl: string;
    createdBy: string;
}

interface GetStreamingRoomsListResp {
    list: StreamingRoom[];
}

export const getStreamingRoomsList = async (req: GetStreamingRoomsListReq): Promise<GetStreamingRoomsListResp> => {
    const url = baseUrl + "stream/rooms/list";
    const resp = await fetch(url ?? "", {
        method: "GET",
        headers: getHeaders(),
    });

    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const apiResp = await resp.json();
    return apiResp as GetStreamingRoomsListResp;
};
