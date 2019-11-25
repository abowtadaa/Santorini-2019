const express = require('express');
const route = express.Router();


let num = 0;
let games = [new santoriniGame(true)];
num ++;
let game;

route.use('/game/:gameId',express.static('./public/gameBoard.html'));



route.get("/game/:gameId",function (req,res){
    console.log("I am in get game")
    //let thisGame = req.params.gameId;
    console.log(thisGame);
    console.log(games[thisGame]);
    res.status(200).json(games[thisGame].board.tile);
})

route.post("/game/:gameId",function (req,res) {
    let thisGame = req.params.gameId
    let respond;
    if(games[thisGame]) {
        console.log(req.body);
        games[thisGame]
        respond = games[thisGame].gameBoardMove(req.body.tile,req.body.pos)
        res.status(200).json(respond);
    }else{
        res.status(204).send("This game doesnt exist");
    }
})

route.post("/game/update/:gameId",function (req,res){

    console.log("I am in get game")
    let thisGame = req.params.gameId;
    console.log(thisGame);
    console.log(games[thisGame]);
    res.status(200).json(games[thisGame].board.tile);
})

route.get("/start",function (req,res){
    if(games.length===0){
        game = new santoriniGame(true)
        games.push(game);
        num++;
        console.log(num);
        res.status(200).json(game.gameId);
    }else{
        if(games[num-1].secondPlayer===null){
            games[num-1].playerJoined(true);
            console.log(num);
            res.status(200).json(games[num-1].gameId);
        }else{
            game = new santoriniGame(true);
            games.push(game);
            num++;
            console.log(num);
            res.status(200).json(game.gameId);
        }
    }


})



route.post("/turn",function (req,res){
    console.log(req.body);
    res.status(200).send("Hello from turn");
})


module.exports = route;




function santoriniGame (host) {
    const EMPTY = -1;
    const BUILDER = 0;
    this.gameId = num;

    this.host = host
    this.secondPlayer = null;
    this.gameBoard = new Board();

    this.playerJoined = function (player) {
        this.secondPlayer = player;
    }

    this.gameBoardMove = function (tile,pos) {


        this.gameBoard.tiles[pos.newCor.y][pos.newCor.x].pieceType = tile.pieceType;
        this.gameBoard.tiles[pos.newCor.y][pos.newCor.x].team = tile.team;

        this.gameBoard.tiles[pos.oldCor.y][pos.oldCor.x].pieceType = EMPTY;
        this.gameBoard.tiles[pos.oldCor.y][pos.oldCor.x].team = EMPTY;


        return this.gameBoard.tiles;
    }

    this.gameBoardBuild = function (tile,pos) {
        this.gameBoard.tiles[pos.newCor.y][pos.newCor.x].buildType++;

        return this.gameBoard;
    }
}

function Board () {


    const INVALID = 0;
    const VALID = 1;
    const VALID_BUILD = 2;


    const BOARD_WIDTH = 5;
    const BOARD_HEIGHT = 5;

    const WHITE = 0;
    const BLACK = 1;

    const EMPTY = -1;
    const BUILDER = 0;

    var buildType = {
        EMPTY:0,
        FIRSTFLOOR:1,
        SECONDFLOOR:2,
        THIRDFLOOR:3,
        DOME:4
    }
    this.tiles = [];

    this.tiles.push([
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),

    ]);
    this.tiles.push([
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(BUILDER, WHITE,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(BUILDER, BLACK,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),

    ]);
    this.tiles.push([
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),

    ]);
    this.tiles.push([
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(BUILDER, BLACK,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(BUILDER, WHITE,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),

    ]);
    this.tiles.push([
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),
        new Tile(EMPTY, EMPTY,buildType.EMPTY),

    ]);




}

function Tile (pieceType,team,buildType) {
    this.pieceType = pieceType;
    this.team = team;
    this.buildType = 0;
}

