const express = require('express');
const cors = require('cors'); //when the clients aren't on the server
const app = express(); //server-app
const userRoutes = require("./routs/user.js");


const DEFAULT_PORT = 8000;

// middleware ------------------------------------
app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body
app.use('/', express.static('client')); //for serving client files
app.use("/users", userRoutes);

// -----------------------------------------------

// endpoint GET ----------------------------------
app.get('/', function (req, res) {
    // code here...

    res.status(200).send("hello from GET"); //send response
});

// endpoint POST ---------------------------------
app.post('/user-register', function (req, res) {
    // code here...
    console.log(req.body); //New user
    res.status(200).send("Plz verify your user!"); //send response
});

app.post('/game-chat', function (req,res) {
    //console.log((req.body)); //Send chat
    res.status(200).send(req.body);
});

app.get("/user-login", function (req,res){

});


app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});