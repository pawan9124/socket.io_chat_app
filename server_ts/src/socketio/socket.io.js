"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const chat_js_1 = require("../routes/chat.js");
const floodPrevention_js_1 = require("./floodPrevention.js");
//number of users  
let numUsers = 0;
const connectSocket = (io, socket) => {
    let addedUser = false;
    // console.log('io------>',sockets)
    //when the client emits 'new message', this listens and executes
    socket.on('newMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const floodObjectResponse = floodPrevention_js_1.floodObject.protectServer(socket);
        if (!floodObjectResponse.isFlooded) {
            const afterMessage = yield (0, chat_js_1.addChatMessage)(data);
            socket.broadcast.emit('newMessage', afterMessage);
            if (floodObjectResponse.count > 10 && floodObjectResponse.count < floodObjectResponse.max) {
                io.to(socket.id).emit("spam_warning", { isWarn: true, message: `You are spamming the chat, total messages ${floodObjectResponse.count} in few seconds, more message than ${floodObjectResponse.max} you are disconnected` });
            }
        }
        else {
            io.to(socket.id).emit('banned', { message: "You are disconnected for flooding the chat", userId: data.id, username: data.username, isBanned: true });
            const socketsList = yield yield io.fetchSockets();
            for (const currentSocket of socketsList) {
                if (currentSocket.id === socket.id) {
                    currentSocket.disconnect(currentSocket.id);
                }
            }
        }
    }));
    //when the clients emits 'typing', we broadcast it to others
    socket.on('typing', ({ id, username }) => {
        socket.broadcast.emit('typing', { id, username, isTyping: true });
    });
    //when the client stop typing, borad cast to others
    socket.on('not_typing', ({ id, username }) => {
        socket.broadcast.emit('not_typing', { id, username, isTyping: false });
    });
    //handle the number of users when logged in 
    socket.on('login', () => {
        numUsers += 1;
    });
    //get the number of user count
    socket.on('get_num_user', () => {
        io.emit('user_count', numUsers);
    });
    //handle the number of users logged out
    socket.on('logout', () => {
        numUsers -= 1;
        if(numUsers > 0){
        io.emit('user_count', numUsers);
        }else {
            numUsers = 0;
        }
    });
};
exports.connectSocket = connectSocket;
