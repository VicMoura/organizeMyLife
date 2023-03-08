const Sequelize = require("sequelize"); 

const connection = new Sequelize('organizemylife', 'root', '26575694', {
    host : 'localhost', 
    dialect : 'mysql'
}); 

module.exports = connection; 