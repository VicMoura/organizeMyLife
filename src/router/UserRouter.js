const express = require("express"); 
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('templates/login');
});

router.get('/cadastro', (req, res) => {
    res.render('templates/cadastro');
});


module.exports = router; 