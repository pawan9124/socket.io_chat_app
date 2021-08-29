import { addChatMessage } from "../routes/chat";
import { floodObject } from './floodPrevention';
import {Socket, Server} from 'socket.io';



//number of users  
let numUsers:number = 0;

type typingProps = {
    id:number,
    username:string
}
export type chatObject = {
    id:number,
    message:string,
    username:string,
}

export const connectSocket = (io:Server, socket:Socket) => {

    //when the client emits 'new message', this listens and executes
    socket.on('newMessage', async (data:chatObject) => {
        const floodObjectResponse = floodObject.protectServer(socket);
        if (!floodObjectResponse.isFlooded) {
            const afterMessage:any = await addChatMessage(data);
            socket.broadcast.emit('newMessage', afterMessage);
            if (floodObjectResponse.count > 8 && floodObjectResponse.count < floodObjectResponse.max) {
                io.to(socket.id).emit("spam_warning", { isWarn: true, message: `You are spamming the chat, total messages ${floodObjectResponse.count} in few seconds, more message than ${floodObjectResponse.max} you are disconnected` })
            }
        } else {
            io.to(socket.id).emit('banned', { message: "You are disconnected for flooding the chat", userId: data.id, username: data.username, isBanned: true });
            const socketsList:any = await await io.fetchSockets();
            for (const currentSocket of socketsList) {
                if (currentSocket.id === socket.id) {
                    currentSocket.disconnect(currentSocket.id);
                }
            }
        }

    });

    //when the clients emits 'typing', we broadcast it to others
    socket.on('typing', ({ id, username }:typingProps) => {
        socket.broadcast.emit('typing', { id, username, isTyping: true });
    });

    //when the client stop typing, borad cast to others
    socket.on('not_typing', ({ id, username }:typingProps) => {
        socket.broadcast.emit('not_typing', { id, username, isTyping: false });
    });

    //handle the number of users when logged in 
    socket.on('login', () => {
        numUsers += 1;
    });

    //get the number of user count
    socket.on('get_num_user',()=>{
        io.emit('user_count',numUsers);
    })

    //handle the number of users logged out
    socket.on('logout', () => {
        numUsers -= 1;
        io.emit('user_count',numUsers);
    });

};