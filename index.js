const express       = require('express');
const app           = express();
const fs            = require('fs');
const bodyParser    = require('body-parser');

const PORT      = 8081;
const DATAFILE  = './data/cards.json';

var cards;

fs.readFile(DATAFILE,'utf-8',function(err,content){
    if (err){
        console.log(err);
    }else{
        cards =  JSON.parse(content);
    }
});

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(function(err,req,res,next){
    res.status(500).send(err);
});
app.use(function(err,req,res,next){
    console.log(err);
    next(err);
});
app.use(function(req, res, next) {
    console.log("Header sets CORS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.get('/getCards',function(req,res){
    res.send(JSON.stringify(cards));
    res.status(200).end('Cards sent');
});
app.post('/addCard',function(req,res,next){
    /*
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        console.log(body);
        res.end('ok');
    });
    */
    //return;

    if (req.body.text !== undefined){
        let card = { id      : Date.now(),text    : req.body.text};
        cards.backlog.items.push(card);
        res.status(200).end(JSON.stringify(card));
    } else{
        console.log(req.body);
        next("Parameter missing");
    }

});

const server = app.listen(PORT,function(){
    console.log(`Server is listening at http:${server.address().address}:${PORT}`);
});

