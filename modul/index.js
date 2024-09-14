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
        unique: true,  // Ensure email is unique
        validate: {
            isEmail: true,  // Validate if it's a proper email format
        }
    },
    password: {
        type: DataTypes.STRING,  // Store password as a string (hashed)
        allowNull: false,
        unique: true,  // Ensure password is unique (hashed)
        validate: {
            len: [8, 100],  // Optional: enforce minimum length (e.g., 8 characters)
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


