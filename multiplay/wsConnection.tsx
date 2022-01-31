import { io } from "socket.io-client";
import { wsServerUrl } from "../config/urls";


export const socketIoClient = io(wsServerUrl)


export default socketIoClient;
