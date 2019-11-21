const express = require('express');
const route = express.Router();

let games = [];

app.get("/game/:gameId", function (req,res) {
    for(game of games){
        if(req.params.gameId===game.id){
            res.status(200).send(game.info);
        }else{
            res.status(404).send("Game doesnt exist");
        }
    }
})