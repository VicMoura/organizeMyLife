const Sequelize = require("sequelize"); 
const connection = require("../../data/database"); 
const Tarefa = require("./Tarefa"); 


const Item = connection.define('item', {
    nome : {
        type : Sequelize.STRING, 
        allowNull : false 
    }, 

    check : {
        type : Sequelize.BOOLEAN, 
        allowNull : false 
    }
});

//Criando a relação de tabelas - FK
Tarefa.hasMany(Item);  
Item.belongsTo(Tarefa); 


module.exports = Item;