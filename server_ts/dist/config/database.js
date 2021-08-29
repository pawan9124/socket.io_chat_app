"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(`postgresql://admin:admin@localhost:5432/chat`);
exports.default = sequelize;
