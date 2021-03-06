"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floodObject = void 0;
//if sending more than 50 message in 10 sec
let FLOOD_INTERVAL = 10000;
let MAX_FLOOD = 12;
exports.floodObject = {
    connections: {},
    lastClearFlood: new Date(),
    protectServer: (socket) => {
        //Reset the flood data when 10 sec passed
        if (Math.abs(new Date() - exports.floodObject.lastClearFlood) > FLOOD_INTERVAL) {
            exports.floodObject.floods = {};
            exports.floodObject.lastClearFlood = new Date();
        }
        exports.floodObject.connections[socket.id] === undefined ? exports.floodObject.connections[socket.id] = {} : exports.floodObject.connections[socket.id];
        exports.floodObject.connections[socket.id].count === undefined ? exports.floodObject.connections[socket.id].count = 0 : exports.floodObject.connections[socket.id].count;
        exports.floodObject.connections[socket.id].count++;
        //Disconnect the socket if he exceed the flood Time and count
        if (exports.floodObject.connections[socket.id].count > MAX_FLOOD) {
            return { isFlooded: true, count: exports.floodObject.connections[socket.id].count, MAX_FLOOD };
        }
        return { isFlooded: false, count: exports.floodObject.connections[socket.id].count, max: MAX_FLOOD };
    }
};
