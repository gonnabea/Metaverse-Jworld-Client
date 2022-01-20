export interface wsRoom {
    createdAt: string;
    creator: string;
    id: string;
    roomName: string;
    userList: Array<any>;
    maxPeopleNum: number;
}

export interface wsUser {
    id: string | number;
    connectedRoomId: string | number;
}