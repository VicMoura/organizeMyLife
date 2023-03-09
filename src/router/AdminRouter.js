const express = require("express"); 
const router  = express.Router(); 
const adminAuth = require("../middleware/adminAuth");

router.get('/tarefas', adminAuth,  (req, res) => {
    res.render('templates/admin/tarefas');
}); 

module.exports = router; 