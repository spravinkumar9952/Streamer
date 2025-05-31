import { handleUnAuthorize } from "./auth";
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
        handleUnAuthorize(resp.status);
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
    console.log("Base URL", baseUrl);
    console.log("Headers", getHeaders());
    const resp = await fetch(url ?? "", {
        method: "GET",
        headers: getHeaders(),
    });

    if (!resp.ok) {
        // handleUnAuthorize(resp.status);
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const apiResp = await resp.json();
    return apiResp as GetStreamingRoomsListResp;
};

interface UpdateVideoUrlReq {
    roomId: string;
    videoUrl: string;
}

interface UpdateVideoUrlResp {
    success: boolean;
}

export const updateVideoUrl = async (req: UpdateVideoUrlReq): Promise<UpdateVideoUrlResp> => {
    const url = baseUrl + "stream/rooms/update-url";
    const resp = await fetch(url ?? "", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(req),
    });

    if (!resp.ok) {
        handleUnAuthorize(resp.status);
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const apiResp = await resp.json();
    return apiResp as UpdateVideoUrlResp;
};

interface DeleteStreamingRoomReq {
    roomId: string;
}

interface DeleteStreamingRoomResp {
    success: boolean;
}

export const deleteStreamingRoom = async (req: DeleteStreamingRoomReq): Promise<DeleteStreamingRoomResp> => {
    const url = baseUrl + "stream/rooms/delete?roomId=" + req.roomId;
    const resp = await fetch(url ?? "", {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!resp.ok) {
        handleUnAuthorize(resp.status);
        const apiResp = await resp.json();
        console.error("deleteStreamingRoom Error", apiResp);
        throw new Error(`HTTP error! : ${resp.status} ${apiResp}`);
    }

    const apiResp = await resp.json();
    return apiResp as DeleteStreamingRoomResp;
};
