export interface wsRoom {
    createdAt: string;
    creator: string;
    id: string;
    roomName: string;
    userList: Array<any>;
    maxPeopleNum: number;
}