// i route-filen angitt over
const express = require('express');
const route = express.Router();
let user = null;

//route.post( [more code] )
route.get('/user',function () {

    console.log(user);
})
route.post('/login', function (req,res){
    if(user) {
        if (user.userName === req.body.userName && user.password === req.body.password) {
            console.log("You are logged in");
            res.status(200).send(user.statistics);
        }else{
            console.log("Wrong password");
            res.status(403).send("Wrong username or password try again")
        }
    }

} )
route.post('/register', function (req,res){
    /*
    if(isNotRegistered()){

    }else{
    res.status()
    }
     */
    user = new userRegistration(req.body);
    console.log(user);
} )

module.exports = route;

    function userRegistration (reqBody) {
        this.userName = reqBody.userName;
        this.password = reqBody.password;
        this.email = reqBody.eMail;
        this.statistics= {
            win:0,
            defeat:0
        }
        this.wins = 0;
        this.defeat = 0;
    }

    function isNotRegistered () {

    }


