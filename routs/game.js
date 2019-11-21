const express = require('express');
const route = express.Router();

let games = [];


app.get("/game/:gameId", function (req,res) {
    for(game og games){
        if(req.params.gameId===game.id){
            res.status(200).send(game.info);
        }else{
            res.status(404).send("Game doesnt exist");
        }
    }
})

app.post("/game", function (req,res){
    console.log(req.body);
})


function santoriniGame (host,gameBoard) {
    this.host = host
    this.secondPlayer = null;
    this.gameBoard = gameBoard;

    this.playerJoined = function (player) {
        this.secondPlayer = playerM;
    }

    this.gameBoardChange = function (tile,pos) {
        this.gameBoard.tile[pos.y][pos.x]=tile;
        return this.gameBoard;
    }
}