const express = require("express"); 
const router  = express.Router(); 
const adminAuth = require("../middleware/adminAuth");
const User = require("../model/User");

router.get('/tarefas', adminAuth,  (req, res) => {
    res.render('templates/admin/tarefas');
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


module.exports = router; 