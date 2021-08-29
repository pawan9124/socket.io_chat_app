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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models/models");
const models_2 = require("../models/models");
const router = express_1.default.Router();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const obj = {
            username: req.body.username,
            password: req.body.password
        };
        //find the user
        const user = yield models_2.User.findOne({ where: obj });
        if (user) {
            const sendObj = Object.assign(Object.assign({}, user.dataValues), { isAuthenticated: true, isNew: false });
            delete sendObj.password;
            delete sendObj.createdAt;
            delete sendObj.updatedAt;
            res.status(201).send(sendObj);
        }
        else {
            const newUser = yield models_2.User.create(obj);
            //check if exists else create
            const sendData = Object.assign(Object.assign({}, newUser.dataValues), { isNew: true, isAuthenticated: true });
            delete sendData.createdAt;
            delete sendData.password;
            delete sendData.updatedAt;
            res.status(201).send(sendData);
        }
    }
    catch (error) {
        console.error("Error while creating or login user", error);
        res.status(400).send(error.message);
    }
}));
router.get('/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield models_1.Chat.findAll({
            include: [{
                    model: models_2.User,
                    attributes: ["id", "username"]
                }],
        });
        res.status(200).send(history);
    }
    catch (error) {
        console.error("Error while fetching the history", error);
        res.status(400).send(error.message);
    }
}));
exports.default = router;
