const express = require('express');
const cors = require('cors'); //when the clients aren't on the server
const app = express(); //server-app

const DEFAULT_PORT = 8000;

// middleware ------------------------------------
app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body
app.use('/', express.static('client')); //for serving client files

// -----------------------------------------------

// endpoint GET ----------------------------------
app.get('/', function (req, res) {
    // code here...
    res.status(200).send("hello from GET"); //send response
});

// endpoint POST ---------------------------------
app.post('/', function (req, res) {
    // code here...
    console.log(req.body); //New user
    res.status(200).send("Plz verify your user!"); //send response
});


app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});