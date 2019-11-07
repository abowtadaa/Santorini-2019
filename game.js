const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');//when the clients aren't on the server

const app = express();

const DEFAULT_PORT = 8000;

const HTTP_CODES = {
    NOT_FOUND: 404,
    OK: 200
};

app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(cors()); //allow all CORS requests
app.use(express.static('public'));
app.use(express.json()); //for extracting json in the request-body

app.post("/"), function (req,res){
    console.log(req.body.userName)
    res.status(200).send("Hello from post");
}




app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});