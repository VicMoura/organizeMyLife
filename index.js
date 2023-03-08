const express = require("express"); 
const app = express(); 

//View Engine 
app.set('view engine', 'ejs'); 
app.set('views', 'src/views'); 


app.get("/", (req, res) => {
    res.render("index");
});

app.listen(8080, ()=>{
    console.log('SERVIDOR FUNCIONANDO');
});