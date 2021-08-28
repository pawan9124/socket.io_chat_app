import { Chat, User } from '../models/models.js';
import { chatObject } from '../socketio/socket.io.js';



export const addChatMessage = (object:chatObject) => {
    return new Promise(async (resolve, reject) => {
        try {
            const preparedData:object = { userId: object.id, message: object.message }
            const userChat:any = await Chat.create(preparedData);
            const currentChat:any = await Chat.findOne({
                where: {
                    id: userChat.dataValues.id
                },
                include: [{
                    model: User,
                    attributes: ["id", "username"]
                }]
            });
            resolve(currentChat);
        } catch (error) {
            console.log("ERROR happened in chat", error);
            reject(error);
        }
    })
}