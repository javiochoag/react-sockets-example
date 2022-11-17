import { ENDPOINT } from "./config";
import { io } from "socket.io-client";

export const socket = io(ENDPOINT, {
  path: "/trucks"
},
{ 
  transports: ["websocket"] 
});