import {Sequelize} from 'sequelize';

const sequelize = new Sequelize(`postgresql://admin:admin@localhost:5432/chat`);

export default sequelize;