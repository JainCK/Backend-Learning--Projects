let express = require('express');
let app = express();
let dotenv = require('dotenv').config();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
})


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
  });

app.use("/public", express.static(__dirname + "/public"));


app.get("/json",(req,res)=>{
    let resultMessage="Hello json";
    if (process.env.MESSAGE_STYLE==="uppercase"){
      resultMessage=resultMessage.toUpperCase();
    }
   
    res.json({"message": resultMessage});
                             
  });


 app.get('/now',(req, res, next) => {
    req.time = new Date().toString();
    next();
 },(req, res) => {
    res.json({
        time : req.time
    });
 });


 app.get('/:word/echo', (req, res) => {
  res.json({echo: req.params.word});
 });

app.get('/name', (req, res) => {
  res.json({ name : `${req.query.first} ${req.query.last}` });
});

app.route('/name').get((req,res)=>{
  res.json({name: `${req.query.first} ${req.query.last}`});
})
.post((req,res)=>{
  res.json({name: `${req.body.first} ${req.body.last}`});
});























 module.exports = app;
