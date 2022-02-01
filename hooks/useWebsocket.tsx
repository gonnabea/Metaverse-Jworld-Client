import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { wsServerUrl } from "../config/urls";
import ws from "ws";

const useWebsocket = () => {
    const { current: wsClient } = useRef<WebSocket>(new WebSocket(wsServerUrl))

    useEffect(() => {

    }, [])

    return [wsClient]
}

export default useWebsocket;