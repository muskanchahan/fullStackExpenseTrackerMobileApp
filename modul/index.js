const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('Expense_db', 'root', 'muskan!!!@00$', {
    host: 'localhost',
    dialect: 'mysql',
});

const expenses = sequelize.define('Expense', {
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
        }
    },
    password: {
        type: DataTypes.STRING,  
        allowNull: false,
        unique: true,  
        validate: {
            len: [8, 100],
        }
    },
});

sequelize.sync()
.then(()=>{
    console.log('database & table created');
})
.catch((error)=>{
    console.log(error);
})


module.exports={
    sequelize,
    expenses,
}


