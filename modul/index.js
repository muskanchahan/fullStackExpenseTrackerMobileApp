const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('expense_db', 'root', 'muskan!!!@00$', {
    host: 'localhost',
    dialect: 'mysql',
});

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

 
module.exports = {User,sequelize,DataTypes};

