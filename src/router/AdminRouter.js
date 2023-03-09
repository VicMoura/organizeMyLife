const express = require("express"); 
const router  = express.Router(); 
const adminAuth = require("../middleware/adminAuth");
const User = require("../model/User");
const Tarefa = require("../model/Tarefa");
const Item = require("../model/Item");

let itens; 


router.get('/tarefas', adminAuth,  (req, res) => {
    let id = req.session.user.id; 
    Tarefa.findAll({
        where : {
            userId : id
        }
    }).then(
        tarefas => {
            res.render('templates/admin/tarefas', {tarefas : tarefas});
        }
    )
}); 

router.get('/user', adminAuth, (req, res) => {
    res.render('templates/admin/user', {user : req.session.user});
});

router.get('/viewTarefas', adminAuth, (req, res) => {
    let id = req.session.user.id;
    let idTarefa = req.params.idTarefa;
    console.log('vendo o ID', idTarefa);
    Tarefa.findAll({
        where : {
            userId : id,
            id : idTarefa
        }
    }).then(
        tarefas => {
            Item.findAll({
                where : {
                    tarefaId : idTarefa
                }
            }).then((item) => {
                res.render('templates/admin/viewTarefa', {tarefa : tarefas, item : item});
            }).catch((erro) => {
                console.log(erro); 
                res.redirect('/tarefas');
            });
        });

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
    console.log(id);

    Tarefa.create({
        nome : nome, 
        situacao : situacao,
        userId : id
    }).then((tarefa) => { 
        res.redirect("/tarefas"); 
    }).catch((erro) => {
        console.log(erro);
        res.redirect("/tarefas"); 
    })
});

router.post('/viewTarefa', adminAuth, (req, res) => {
    let id = req.body.tarefaId; 
    req.session.tarefa = {
        id : id
    }
     Tarefa.findOne({
        where : {
            id : id
        }
    }).then(
        tarefas => {
            Item.findAll({
            }).then((item) => {
                res.render('templates/admin/viewTarefa', {tarefa : tarefas, item : item});
            }).catch((erro) => {
                console.log(erro); 
                res.redirect('/tarefas');
            })
           
    }).catch((erro) => {
        console.log(erro); 
        res.redirect('/tarefas');
    })

  
});


router.post('/criarItem', adminAuth, (req, res) => {

    let nome = req.body.nome; 
    let check = req.body.check; 
    let id = req.body.tarefaId
    Tarefa.findOne({
        where : {
            id : id
        }
    }).then(
        tarefas => {
            Item.create({
                nome : nome, 
                check : check,
                tarefaId : id
            }).then(() => {
                    Item.findAll({
                    }).then((item) => {
                        res.render('templates/admin/viewTarefa', {tarefa : tarefas, item : item});
                    }).catch((erro) => {
                        console.log(erro); 
                        res.redirect('/tarefas');
                    })
            }).catch((erro) => {
                console.log(erro);
                res.redirect('/tarefas'); 
            })
    }).catch((erro) => {
        console.log(erro); 
        res.redirect('/tarefas');
    })

          

});

router.post('/deleteItem', adminAuth, (req, res) => {

    let item = req.body.checkbox;
    let id = req.body.idTarefa; 
    console.log('SOCORROOO', id);


    Tarefa.findOne({
        where : {
            id : id
        }
    }).then(
        tarefas => {
                Item.destroy({where: {
                    id : item
                }}).then(function () {
                        Item.findAll({}).then((itens) => {
                                res.render('templates/admin/viewTarefa', {tarefa : tarefas, item : itens});
                        }).catch((erro) => {
                            console.log(erro); 
                            res.redirect('/tarefas');
                        })
                }).catch((erro) => {
                        console.log(erro); 
                        res.redirect('/tarefas');
                });
    }).catch((erro) => {
        console.log(erro); 
        res.redirect('/tarefas');
    })

    
    

});

module.exports = router; 