import { makeVar } from "@apollo/client";

export const applyChatStatus = makeVar({  
    chatContents: [],
    newMsgCount: 0,
    sendBroadChat: null,
    chatInput: null,
    startBgm: null,

});

export const setChatStatus = ({
    chatContents,
    newMsgCount,
    sendBroadChat,
    chatInput,
    startBgm,

}) => {
    applyChatStatus({ 
        chatContents,
        newMsgCount,
        sendBroadChat,
        chatInput,
        startBgm
    });
};