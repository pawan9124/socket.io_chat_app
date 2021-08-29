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
exports.addChatMessage = void 0;
const models_1 = require("../models/models");
const addChatMessage = (object) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const preparedData = { userId: object.id, message: object.message };
            const userChat = yield models_1.Chat.create(preparedData);
            const currentChat = yield models_1.Chat.findOne({
                where: {
                    id: userChat.dataValues.id
                },
                include: [{
                        model: models_1.User,
                        attributes: ["id", "username"]
                    }]
            });
            resolve(currentChat);
        }
        catch (error) {
            console.log("ERROR happened in chat", error);
            reject(error);
        }
    }));
};
exports.addChatMessage = addChatMessage;
