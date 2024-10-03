const { sequelize, DataTypes } = require('./index'); // Adjust path as necessary

const Expense = sequelize.define('Expense', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = Expense;
