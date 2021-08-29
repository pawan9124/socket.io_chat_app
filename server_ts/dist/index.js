"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes/routes"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const socket_io_2 = require("./socketio/socket.io");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const socketio = new socket_io_1.Server(server);
const port = 4000;
//connect to the database
database_1.default
    .authenticate()
    .then(() => {
    database_1.default.sync();
    console.log(`Connection has been established successfully`);
})
    .catch((error) => {
    console.error(`Unable to connect  to the database:'`, error);
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//routes
app.use('/api', routes_1.default);
//socket io 
socketio.on("connection", (socket) => {
    console.log("SOcket get connected");
    (0, socket_io_2.connectSocket)(socketio, socket);
});
//routes
app.get('/', (req, res) => {
    res.json({ message: "Hello from the other side" });
});
server.listen(port, () => {
    console.log(`Chat app is running on the port ${port}`);
});
