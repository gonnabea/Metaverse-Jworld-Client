import { makeVar } from "@apollo/client";
import { Chat } from "../components/threeComponents/streamWorldModels/wsPayloads";

interface chatStatus {
    chatContents: Chat[];
    newMsgCount: number;
}

export const applyChatStatus = makeVar<chatStatus>({  
    chatContents: [],
    newMsgCount: 0,
});

// 새로운 채팅 내용 추가
export const addChat = ( chatContents: Chat ) => {
    const originalChats = applyChatStatus().chatContents;
    originalChats.push(chatContents)
    applyChatStatus({
        ...applyChatStatus(),
        chatContents: originalChats
    })
}

// 새 메세지 수 up
export const addNewMsgCount = () => {
    const originalCount = applyChatStatus().newMsgCount;
    applyChatStatus({
        ...applyChatStatus(),
        newMsgCount: originalCount + 1
    })
}

// 새 메세지 수 초기화
export const initMsgCount = () => {
    applyChatStatus({
        ...applyChatStatus(),
        newMsgCount: 0
    })
}
