const express = require("express"); 
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const User = require("../model/User");
const nodemailer = require("nodemailer");
const Swal = require('sweetalert2')

//Criando o transporter do nodemailer 
let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: { 
       user: 'vicmourator@gmail.com', 
       pass: 'wqiclhdkahumbihr' 
     } 
});


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

    console.log(nome, email, senha +'teste');



    if(!nome || !email || !senha) { 
        res.redirect("/cadastro"); 
    }else{
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
                    res.send('<script>alert("Usuário criado com sucesso!"); window.location.href = "/login"; </script>');
                }).catch((erro) => {
                    console.log(erro);
                    res.redirect("/"); 
                });
    
            }else {
                res.send('<script>alert("Usuário já existe!"); window.location.href = "/cadastro"; </script>');
            }
    
        }).catch((erro) => {
            console.log(erro); 
            res.redirect("/"); 
        })
    }


});

router.post('/autenticacao', (req, res) => {

    let email = req.body.email; 
    let senha = req.body.senha; 

    if(!email || !senha){
        res.redirect('/login'); 
    }else {
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
                    res.send('<script>alert("Email ou senha inválidos!"); window.location.href = "/login"; </script>');
                }
    
            }else{
                res.send('<script>alert("Usuário não existe!"); window.location.href = "/login"; </script>');
            }
    
        }).catch((erro) => {
            console.log(erro);
        });
    }

}); 

router.get('/logout', (req, res) => {
    if(req.session.user != undefined){
        req.session.user = undefined;
        res.redirect("/");
    }else {
        res.redirect("/");
    }
});


router.get("/recuperarSenha", (req, res) => {
    res.render('templates/users/recuperarSenha'); 
});

router.get("/redefinirSenha", (req, res) => {
    res.render('templates/users/redefinirSenha'); 
});

router.post("/enviarCodigoEmail", (req, res) => {

    let email = req.body.email; 
    let codigo = Math.floor(Math.random() * 65536); 

    User.findOne({
        where : {
            email : email
            }
    }).then((user) => {
        req.session.idUser = {
            id : user.id
        }

        transporter.sendMail({
            from : "vicmourator@gmail.com",
            to : email,
            subject : "REDEFINIÇÃO DE SENHA", 
            text : "Por favor, insira o seguinte código para redefinir a sua senha:", 
            html : "<h3>SEU CÓDIGO É <h3>" + codigo
        }).then((message) => {
            res.render('templates/users/codigoEmail', {codigoEmail : codigo});  
        }).catch(err => {
            console.log(err); 
        });

    }).catch((erro) => {
        res.redirect('/login');
    })

    

});

router.post("/validarCodigo", (req, res) => {
    let codigo = req.body.codigoEmail; 
    let codigoInserido = req.body.codigoInserido;

    if(codigo == codigoInserido){
        res.send('<script>alert("Código validado, digite a nova senha!"); window.location.href = "/redefinirSenha"; </script>');
    }else{
        res.send('<script>alert("Código Inválido!"); window.location.href = "/recuperarSenha"; </script>');
    }

    

});

router.post("/redefinirSenha", (req, res) => {
    let senha = req.body.senha; 
    let id = req.session.idUser.id; 
    let salt = bcrypt.genSaltSync(10); 
    let hash = bcrypt.hashSync(senha, salt); 
  console.log(id);

        User.update({
            senha : hash
        }, {
            where : {
                id : id
            }
        }).then(() => {
            res.send('<script>alert("Senha redefinida com sucesso!"); window.location.href = "/login"; </script>');
        })
    

});

module.exports = router; 