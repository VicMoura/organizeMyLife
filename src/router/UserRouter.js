const express = require("express"); 
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const User = require("../model/User");

router.get('/login', (req, res) => {
    res.render('templates/users/login');
});

router.get('/cadastro', (req, res) => {
    res.render('templates/users/cadastro');
});

router.post('/cadastro/usuario', (req, res) => {
    let nome = req.body.nome; 
    let email = req.body.email; 
    let senha = req.body.senha; 

    User.findOne({
        where : {
            email : email 
        }
    }).then(user => {

        if(user == undefined){
            let salt = bcrypt.genSaltSync(10); 
            let hash = bcrypt.hashSync(senha, salt); 

            User.create({
                nome : nome, 
                email : email, 
                senha : hash
            }).then(() => {
                res.redirect("/"); 
            }).catch((erro) => {
                console.log(erro);
                res.redirect("/"); 
            });

        }else {
            res.redirect("/"); 
        }

    }).catch((erro) => {
        console.log(erro); 
        res.redirect("/"); 
    })


});

module.exports = router; 