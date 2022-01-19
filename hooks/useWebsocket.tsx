import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { addNewMsgCount, setChatStatus } from "../stores/chatStatus";

const useWebsocket = () => {

    const { current: socketIoClient } = useRef<Socket>(io('ws://localhost:4001'))

    const createConnection = () => {
        socketIoClient.emit("enter-lobby", {nickname, userId})
        
    }

    useEffect(() => {

    }, [])

    return [socketIoClient]
}

export default useWebsocket;