const express = require("express"); 
const router  = express.Router(); 
const adminAuth = require("../middleware/adminAuth");
const User = require("../model/User");
const Tarefa = require("../model/Tarefa");
const Item = require("../model/Item");

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


router.post('/apagarConta', adminAuth, (req, res) => {
    let id = req.body.id; 

    if(id != undefined){
        if(!isNaN(id)){
            Tarefa.findOne({
                where: {
                    userId : id
                }
                }).then(tarefa => {
                
                        Item.destroy({
                            where : {
                                tarefaId : tarefa.id
                            }
                        }).then(() => {
                            Tarefa.destroy({
                                where : {
                                    id : tarefa.id
                                }
                            }).then(() => {
        
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
                            }).catch((erro) => {
                                console.log(erro); 
                                res.redirect('/');
                            })
                
                        }).catch((erro) => {
                            console.log(erro); 
                            res.redirect('/');
                        })
        
                }).catch((erro) => {
                    console.log(erro); 
                    res.redirect('/');
                })
            
        }else{
            res.redirect("/user"); 
        }
    }
});



router.post('/criarLista', adminAuth, (req, res) => {

    let nome = req.body.nomeCriarLista; 
    let situacao = req.body.situacaoCriarLista; 
    let id = req.session.user.id; 
    console.log(nome + 'NOME DA LISTA\n'); 
    console.log(situacao + 'SITUACAO DA LISTA\n'); 
    console.log(id + 'SITUACAO DA LISTA\n'); 

    if(nome && (situacao != 'undefined')){
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
    }

});

router.get('/viewTarefa/:tarefaId', adminAuth, (req, res) => {
    let id = req.params.tarefaId; 
    console.log("ESSE É O ID VIEWTAREFA " + id);

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
    
    if(nome){
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
    }

          

});

router.post('/deleteItem', adminAuth, (req, res) => {

    let item = req.body.idItem;
    let id = req.body.tarefaId; 
    console.log('SOCORROOO', id);
    console.log('SOCORROOO', item);

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

router.post('/alterarSituacao', adminAuth, (req, res) => {

    let idItem = req.body.idItem;
    let id = req.body.tarefaId; 
    let trueOrFalse; 

    Item.findOne({
        where : {
            id : idItem
        }
    }).then(item => {
        trueOrFalse = !item.check; 
    }).catch((erro) => {
        console.log(erro);
    })


    Tarefa.findOne({
        where : {
            id : id
        }
    }).then(
        tarefas => {
            Item.update({
                check : trueOrFalse
                },
                {
                where : {
                    id : idItem
                    }
                 }).then(function () {
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

router.post('/deleteLista', adminAuth, (req, res) => {

    let id = req.body.tarefaId; 
    
    Item.destroy({
        where : {
            tarefaId : id
        }
    }).then(() => {
        Tarefa.destroy({
            where : {
                id : id
            }
        }).then(() => {
            res.redirect('/tarefas');

        }).catch((erro) => {
            console.log(erro); 
            res.redirect('/tarefas');
        })

    }).catch((erro) => {
        console.log(erro); 
        res.redirect('/tarefas');
    })

});

router.post('/editarLista', adminAuth, (req, res) => {

    let nome = req.body.nome; 
    let situacao = req.body.situacao; 
    let id = req.session.user.id; 
    let tarefaId = req.body.tarefaId;



    if(nome && situacao == 'undefined'){
        Tarefa.update({
            nome : nome 
        }, {
            where : {
                userId : id,
                id : tarefaId
            }
        }).then(() => { 
            res.redirect("/tarefas"); 
        }).catch((erro) => {
            console.log(erro);
            res.redirect("/tarefas"); 
        })
    }

    if(situacao != 'undefined' && !nome){
        Tarefa.update({
            situacao : situacao 
        }, {
            where : {
                userId : id,
                id : tarefaId
            }
        }).then(() => { 
            res.redirect("/tarefas"); 
        }).catch((erro) => {
            console.log(erro);
            res.redirect("/tarefas"); 
        })
    }

    if(nome && situacao != 'undefined'){
        Tarefa.update({
            nome : nome,
            situacao : situacao
        }, {
            where : {
                userId : id,
                id : tarefaId
            }
        }).then(() => { 
            res.redirect("/tarefas"); 
        }).catch((erro) => {
            console.log(erro);
            res.redirect("/tarefas"); 
        })
    }

});

router.post('/filtrarLista', adminAuth, (req, res) => {

    let situacao = req.body.situacao; 
    let id = req.session.user.id; 
    
    console.log(id + 'ID');
    console.log(situacao + 'SITUACAO'); 
 

    if(situacao != 'undefined'){
        parseInt(situacao);
        Tarefa.findAll({
            where : {
                userId : id,
                situacao : situacao
            }
        }).then((tarefa) => { 
            res.render("templates/admin/tarefas", {tarefas : tarefa}); 
        }).catch((erro) => {
            console.log(erro);
            res.redirect("/tarefas"); 
        })
    }
});


module.exports = router; 