const pg = require('pg');
const dbURI = "postgres://uuvcwgoifcnizu:2316c7908138ef053a96645eb6abd39e84e8b36b86f73309cee43f32b4533110@ec2-54-247-92-167.eu-west-1.compute.amazonaws.com:5432/ddov05lflkkq5f" + "?ssl=true";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({ connectionString: connstring });

const secret = "hitlerdidnothingwrong";
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const express = require('express');
const cors = require('cors'); //when the clients aren't on the server
const app = express(); //server-app

const gameRoutes = require("./routs/game.js");




const DEFAULT_PORT = 8000;



// middleware ------------------------------------
app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body
app.use('/', express.static('public')); //for serving client files
app.use('/login',express.static('public/login.html'));
app.use('/home',express.static('public/index.html'));
app.use('/reqister',express.static('public/register.html'));
app.use("/games", gameRoutes);


// -----------------------------------------------

// endpoint GET ----------------------------------
app.get('/users', async function (req, res) {

  let sql = 'SELECT * from users';
  try {
    let result = await pool.query(sql);
    //console.log(result);
    res.status(200).json(result.rows);

  }
  catch (err) {
    res.status(500).json({ error: err });
  }

  res.status(200).send("hello from GET"); //send response
});

// endpoint POST ---------------------------------
app.post('/users/register', async function (req, res) {
  console.log(req.body);

  let updata = req.body;

  let hash = bcryptjs.hashSync(updata.password, 10);

  let sql = 'INSERT INTO users (id, email, username, pswhash) VALUES(DEFAULT, $1, $2, $3) RETURNING *';
  let values = [updata.email, updata.username, hash];

  try {
    let result = await pool.query(sql, values);

    if (result.rows.length > 0) {
      res.status(200).json({ msg: "Insert OK" });
    }
    else {
      throw "Insert failed;"
    }
  }
  catch (err) {
    res.status(500).json({ error: err });
  }
  // console.log(req.body); //New user
  // res.status(200).send("Plz verify your user!"); //send response
});

app.post('/users/login', async function (req, res) {

  let updata = req.body;    

  let sql = 'SELECT * FROM users WHERE email = $1';
  let values = [updata.email];

  try {
      let result = await pool.query(sql, values);

      if (result.rows.length == 0) {
          res.status(400).json({ msg: "User doesn't exists" });
      }
      else {
          let check = bcrypt.compareSync(updata.passwrd, result.rows[0].pswhash);
          if (check == true) {
              let payload = { userid: result.rows[0].id };
              let tok = jwt.sign(payload, secret, { expiresIn: "12h" });
              res.status(200).json({ email: result.rows[0].email, userid: result.rows[0].id, token: tok });
          }
          else {
              res.status(400).json({ msg: "Wrong password" });
          }
      }
  }
  catch (err) {
      res.status(500).json({ error: err });
  }
});

app.post('/game-chat', function (req, res) {
  //console.log((req.body)); //Send chat
  res.status(200).send(req.body);
});

app.get("/user-login", function (req, res) {

});


app.listen(app.get('port'), function () {
  console.log('server running', app.get('port'));
});