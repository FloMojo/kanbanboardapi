const express       = require('express');
const app           = express();
const fs            = require('fs');
const bodyParser    = require('body-parser');

const //application consts
 PORT      = 8081,
 DATAFILE  = './data/cards.json';
//global model
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


/*
 * API functions
 */
app.get('/getCards',function(req,res){
    res.send(JSON.stringify(cards));
    res.status(200).end('Cards sent');
});
app.post('/addCard',function(req,res,next){
    if (req.body.text !== undefined){
        let card = { id      : Date.now(),text    : req.body.text};
        cards.backlog.items.push(card);
        res.status(200).end(JSON.stringify(card));
    } else{
        console.log(req.body);
        next("Parameter missing");
    }

    saveCards(cards);
});
app.post( '/setNewStatus',function(req,res){
    var 
    elementFound    = null,
    data            = cards,
    itemId          = req.body.itemId,
    stop            = false;

    console.log(`Item ${itemId} clicked`);

    for (var section in data){
        console.log(section);
        if (!stop){
            if(elementFound === null){
                data[section].items = data[section].items.map(element => {
                    if(itemId === element.id){
                        elementFound = element;
                        return null;
                    }else{
                        return element;
                    }
                }).filter(nullElement => {
                    if(nullElement !== null){
                        return nullElement;
                    }
                });
            }else{
                data[section].items.push(elementFound);
                elementFound = null;
                stop = true;
            }
        }
    }

    res.status(200).end(JSON.stringify(cards));

    saveCards(cards);
});
/*
 * Starting server
 */
const server = app.listen(PORT,function(){
    console.log(`Server is listening at http:${server.address().address}:${PORT}`);
});

const saveCards = function(updatedCards){
    fs.writeFile( DATAFILE, JSON.stringify(updatedCards), { encoding : 'utf-8'}, function(err){
        if ( err ) {
            console.log(err);
        }
    });
};

