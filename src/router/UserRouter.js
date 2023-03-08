const express = require("express"); 
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('templates/users/login');
});

router.get('/cadastro', (req, res) => {
    res.render('templates/users/cadastro');
});


module.exports = router; 