const express = require("express"); 
const router  = express.Router(); 
const adminAuth = require("../middleware/adminAuth");
const User = require("../model/User");
const Tarefa = require("../model/Tarefa");

router.get('/tarefas', adminAuth,  (req, res) => {
    Tarefa.findAll().then(
        tarefas => {
            res.render('templates/admin/tarefas', {tarefas : tarefas});
        }
    )
}); 

router.get('/user', adminAuth, (req, res) => {
    res.render('templates/admin/user', {user : req.session.user});
});

router.post('/apagarConta', adminAuth, (req, res) => {
    let id = req.body.id; 
    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({
                where : {
                    id : id
                }
            }).then(() => {
                res.redirect("/"); 
            }).catch((erro) => {
                console.log(erro); 
                res.redirect("/user"); 
            }); 

        }else{
            res.redirect("/user"); 
        }
    }
});



router.post('/criarLista', adminAuth, (req, res) => {

    let nome = req.body.nome; 
    let situacao = req.body.situacao; 
    let id = req.session.user.id; 

    Tarefa.create({
        nome : nome, 
        situacao : situacao,
        userId : id
    }).then(() => {
        res.redirect("/tarefas"); 
    }).catch((erro) => {
        console.log(erro);
        res.redirect("/tarefas"); 
    })
});

module.exports = router; 