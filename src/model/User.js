const Sequelize = require("sequelize"); 
const connection = require("../../data/database"); 

const User = connection.define('user', {
    nome : {
        type : Sequelize.STRING, 
        allowNull : false 
    }, 
    email : {
        type : Sequelize.STRING, 
        allowNull : false 
    }, 
    senha : {
        type : Sequelize.STRING, 
        allowNull : false 
    }
});


module.exports = User; 