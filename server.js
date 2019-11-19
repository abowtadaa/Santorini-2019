const express = require('express');
const cors = require('cors'); //when the clients aren't on the server
const app = express(); //server-app
const userRoutes = require("./routs/user.js");
const pg = require('pg');
const dbURI = "postgres://uuvcwgoifcnizu:2316c7908138ef053a96645eb6abd39e84e8b36b86f73309cee43f32b4533110@ec2-54-247-92-167.eu-west-1.compute.amazonaws.com:5432/ddov05lflkkq5f";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool ({ connectionString: connstring });


const DEFAULT_PORT = 8000;



// middleware ------------------------------------
app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body
app.use('/', express.static('client')); //for serving client files
app.use("/users", userRoutes);

// -----------------------------------------------

// endpoint GET ----------------------------------
app.get('/users',  async function (req, res) {

    let sql = 'SELECT * from users';
    try {
      let result = await pool.query(sql);
      res.status(200).json(result.rows);
    }
    catch(err) {
      res.status(500).json({error: err});
    }

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