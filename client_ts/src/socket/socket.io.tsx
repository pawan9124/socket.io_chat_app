
import { io } from "socket.io-client";
let socket: any;
socket =  io('http://localhost:4000', {
        transports: ["websocket", "polling", "flashsocket"],
    });

export const socketConnection = socket;
