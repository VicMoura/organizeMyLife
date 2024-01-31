const Sequelize = require("sequelize"); 

const connection = new Sequelize('organizemylife', 'root', 'admin123', {
    host : 'localhost', 
    dialect : 'mysql'
}); 

module.exports = connection; 