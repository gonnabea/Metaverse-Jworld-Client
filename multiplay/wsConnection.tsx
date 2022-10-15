import { io } from "socket.io-client";


export const socketIoClient = io(process.env.NEXT_PUBLIC_WS_URL)


export default socketIoClient;
