const express = require("express"); 
const app = express(); 
const bodyParser = require("body-parser");
const connection = require("../data/database"); 

//View Engine 
app.set('view engine', 'ejs'); 
app.set('views', 'views'); 

//Static 
app.use(express.static('views/public'));
app.use(express.static('views/img'));

//Body parser
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json()); 

//Database
connection.authenticate()
.then(()=>
{
    console.log("Conexão feita com sucesso!"); 
})
.catch((error) => {
    console.log(error);
});

const User = require("./model/User"); 
const Tarefa = require("./model/Tarefa"); 
const Item = require("./model/Item"); 

//Importando rotas 
const userRouter = require("./router/UserRouter");
const adminRouter = require("./router/AdminRouter");

app.use('/', userRouter);
app.use('/', adminRouter);


app.get("/", (req, res) => {
    res.render("index");
});

app.listen(8080, ()=>{
    console.log('SERVIDOR FUNCIONANDO');
});