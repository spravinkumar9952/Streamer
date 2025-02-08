import { baseUrl, getHeaders } from "./common";

interface CreateStreamingRoomReq {
    roomName: string;
    friends: string[];
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

interface getStreamingRoomsListReq {}

interface getStreamingRoomsListResp {}

export const getStreamingRoomsList = async (req) => {
    const url = baseUrl + "stream/rooms/list";
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
