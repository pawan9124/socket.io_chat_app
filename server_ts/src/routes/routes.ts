import express, {Request,Response} from 'express';
import { Chat } from '../models/models.js';
import { User } from '../models/models.js';


const router = express.Router();

router.post('/login', async (req:Request, res:Response) => {
    try {
        const obj = {
            username: req.body.username,
            password: req.body.password
        }
        //find the user
        const user:any = await User.findOne({where:obj});
        if(user){
            const sendObj = {
                ...user.dataValues,
                isAuthenticated:true,
                isNew:false
            }
            delete sendObj.password;
            delete sendObj.createdAt;
            delete sendObj.updatedAt;
            res.status(201).send(sendObj);
        } else {
            const newUser:any = await User.create(obj);
        
        //check if exists else create

        const sendData = {
            ...newUser.dataValues,
            isNew: true,
            isAuthenticated:true
        };
        delete sendData.createdAt;
        delete sendData.password;
        delete sendData.updatedAt;
        res.status(201).send(sendData);
    }

    } catch (error) {
        console.error("Error while creating or login user", error);
        res.status(400).send(error.message);
    }
});

router.get('/history',async (req:Request,res:Response)=>{
    try {
        const history:any = await Chat.findAll({
            include:[{
                model:User,
                attributes:["id","username"]
            }],
            
        });
        res.status(200).send(history);
    } catch (error) {
        console.error("Error while fetching the history",error);
        res.status(400).send(error.message);
    }
})

export default router;