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

router.post('/autenticacao', (req, res) => {

    let email = req.body.email; 
    let senha = req.body.senha; 

    User.findOne({
        where : {
            email : email 
        }
    }).then(user => {
        if(user != undefined){

            let correct = bcrypt.compareSync(senha, user.senha); 
            req.session.user = undefined; 

            if(correct){
                req.session.user = {
                    id : user.id, 
                    email : user.email,
                    nome : user.nome
                }

                res.redirect('/tarefas'); 

            }else {
                res.redirect('/login'); 
            }

        }else{
            res.redirect('/login'); 
        }

    }).catch((erro) => {
        console.log(erro);
    });

}); 

router.get('/logout', (req, res) => {
    if(req.session.user != undefined){
        req.session.user = undefined;
        res.redirect("/");
    }else {
        res.redirect("/");
    }
})

module.exports = router; 