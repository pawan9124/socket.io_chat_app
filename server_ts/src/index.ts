import express, {Application,Request,Response} from 'express';
import sequelize from './config/database';
import apiRoutes from './routes/routes';
import {Server,Socket} from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { connectSocket } from './socketio/socket.io';


const app:Application = express();
const server = createServer(app);
const socketio:Server = new Server(server)
const port:number = 4000;



//connect to the database
sequelize
.authenticate()
.then(()=>{
    sequelize.sync()
    console.log(`Connection has been established successfully`);
})
.catch((error:any)=>{
    console.error(`Unable to connect  to the database:'`,error);
});



app.use(express.json());
app.use(cors());

//routes
app.use('/api',apiRoutes);

//socket io 
socketio.on("connection",(socket:Socket)=>{
    console.log("SOcket get connected");
    connectSocket(socketio,socket);
})
//routes
app.get('/',(req:Request,res:Response)=>{
    res.json({message:"Hello from the other side"});
});

server.listen(port,()=>{
    console.log(`Chat app is running on the port ${port}`);
});
