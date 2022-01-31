import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { wsServerUrl } from "../config/urls";

const useWebsocket = () => {

    const { current: socketIoClient } = useRef<Socket>(io(wsServerUrl))

    useEffect(() => {

    }, [])

    return [socketIoClient]
}

export default useWebsocket;