"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.User = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../config/database"));
//Define a model for the user
exports.User = database_1.default.define('users', {
    //attributes
    username: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports.Chat = database_1.default.define('chats', {
    message: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports.User.hasMany(exports.Chat, {
    onDelete: "cascade",
    foreignKey: {
        allowNull: false
    }
});
exports.Chat.belongsTo(exports.User);
