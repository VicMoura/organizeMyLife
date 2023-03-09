const Sequelize = require("sequelize"); 
const connection = require("../../data/database"); 
const User = require("./User"); 

const Tarefa = connection.define('tarefa', {
    nome : {
        type : Sequelize.STRING, 
        allowNull : false 
    }, 
    situacao : {
        type : Sequelize.STRING, 
        allowNull : false 
    }
});

//Criando a relação de tabelas - FK
User.hasMany(Tarefa);  
Tarefa.belongsTo(User); 


module.exports = Tarefa;