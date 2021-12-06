import { io } from "socket.io-client";


export const socketIoClient = io('ws://localhost:4001')


export default socketIoClient;