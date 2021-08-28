//if sending more than 50 message in 10 sec
import {Socket} from 'socket.io';
let FLOOD_INTERVAL:number = 10000;
let MAX_FLOOD:number = 10;

export let floodObject:any = {
    connections:{},
    lastClearFlood: new Date(),
    protectServer:(socket:Socket)=>{
        const todayDate:any= new Date();
        //Reset the flood data when 10 sec passed
        if(Math.abs(todayDate - floodObject.lastClearFlood) > FLOOD_INTERVAL){
            floodObject.floods = {};
            floodObject.lastClearFlood = new Date();
        }
        floodObject.connections[socket.id] === undefined ? floodObject.connections[socket.id]={}:floodObject.connections[socket.id];
        floodObject.connections[socket.id].count === undefined?floodObject.connections[socket.id].count=0:floodObject.connections[socket.id].count;
        floodObject.connections[socket.id].count++;
        
        //Disconnect the socket if he exceed the flood Time and count
        if(floodObject.connections[socket.id].count > MAX_FLOOD){
            return {isFlooded:true,count:floodObject.connections[socket.id].count,MAX_FLOOD};
        }
        return {isFlooded:false,count:floodObject.connections[socket.id].count,max:MAX_FLOOD};
    }
}
