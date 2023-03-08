const express = require("express"); 
const router  = express.Router(); 

router.get('/tarefas', (req, res) => {
    res.render('templates/admin/tarefas');
}); 

module.exports = router; 