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

connection.sync({ force: false })
    .then(() => {
        console.log('Tabela de usuários criada com sucesso.');
    })
    .catch(err => {
        console.error('Erro ao criar tabela de usuários:', err);
    });



module.exports = User; 