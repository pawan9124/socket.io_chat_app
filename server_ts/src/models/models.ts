import Sequelize from 'sequelize';
import db from '../config/database.js';

//Define a model for the user
export const User:Sequelize.ModelCtor<any> = db.define('users',{
    //attributes
    username:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

export const Chat:Sequelize.ModelCtor<any> = db.define('chats',{
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

User.hasMany(Chat,{
    onDelete:"cascade",
    foreignKey:{
        allowNull:false
    }
});
Chat.belongsTo(User);



