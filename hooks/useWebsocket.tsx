import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useWebsocket = () => {
    const { current: socketIoClient } = useRef<Socket>(io(process.env.NEXT_PUBLIC_WS_URL, {transports:['websocket']}))

    useEffect(() => {
    
    }, [])

    return [socketIoClient]
}

export default useWebsocket;