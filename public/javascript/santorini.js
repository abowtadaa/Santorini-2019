const BOARD_WIDTH = 5;
const BOARD_HEIGHT = 5;

let host;
let secondPlayer;

const TILE_SIZE = 50;
const WHITE_TILE_COLOR = "rgb(51, 204, 51)";
const BLACK_TILE_COLOR = "rgb(0, 153, 51)";
const HIGHLIGHT_COLOR = "rgb(255, 0, 255)";
const WHITE = 0;
const BLACK = 1;

const EMPTY = -1;
const BUILDER = 0;


const MOVE =0;
const BUILD=1;

let MODE = MOVE;

const INVALID = 0;
const VALID = 1;
const VALID_BUILD = 2;

const buildType = {
    EMPTY:0,
    FIRSTFLOOR:1,
    SECONDFLOOR:2,
    THIRDFLOOR:3,
    DOME:4
}

const piecesCharacters = {
    0: '⚒',
    1: '▁',
    2: '▃',
    3: '▆',
    4: '☗',

};



let santoriniCanvas;
let santoriniCtx;
let currentTeamText;
let whiteCasualitiesText;
let blackCasualitiesText;
let totalVictoriesText;

let board;
let currentTeam;

let curX;
let curY;



document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    santoriniCanvas = document.getElementById("canvas");
    santoriniCtx = santoriniCanvas.getContext("2d");
    santoriniCanvas.addEventListener("click", onClick);

    currentTeamText = document.getElementById("currentTeamText");

    
    startGame();
}

function startGame() {    
    board = new Board();
    curX = -1;
    curY = -1;

    currentTeam = BLACK;
    currentTeamText.textContent = "Blue's turn";

    repaintBoard();

}

function onClick(event) {
    let santoriniCanvasX = santoriniCanvas.getBoundingClientRect().left;
    let santoriniCanvasY = santoriniCanvas.getBoundingClientRect().top;

    let x = Math.floor((event.clientX-santoriniCanvasX)/TILE_SIZE);
    let y = Math.floor((event.clientY-santoriniCanvasY)/TILE_SIZE);


    if (checkValidMovement(x, y) === true) {


        if (checkValidCapture(x, y) === true) {

            buildSelectedPiece(x, y);


            changeCurrentTeam();
        }else{
            if (board.tiles[y][x].buildType === buildType.THIRDFLOOR) {
                /*if (currentTeam === WHITE) whiteVictories++;
                else blackVictories++;*/

                //startGame();
            }
            moveSelectedPiece(x, y);

        }




    } else {
        board.resetValidMoves();
        curX = x;
        curY = y;
    }

    repaintBoard();

}
    ///TODO Interesting!!!
function checkPossiblePlays() {
    if (curX < 0 || curY < 0) return;

    let tile = board.tiles[curY][curX];
    if (tile.team === EMPTY || tile.team !== currentTeam) return;

    drawTile(curX, curY, HIGHLIGHT_COLOR);

    board.resetValidMoves();

    if (tile.pieceType === BUILDER) checkPossiblePlaysBuilder(curX, curY);
}




function checkPossiblePlaysBuilder(curX, curY) {
    for (let i = -1; i <= 1; i++) {
        if (curY+i < 0 || curY+i > BOARD_HEIGHT-1) continue;

        for (let j = -1; j <= 1; j++) {
            if (curX+j < 0 || curX+j > BOARD_WIDTH-1) continue;
            if (i == 0 && j == 0) continue;

            checkPossiblePlay(curX+j, curY+i);
        }
    }

}

function checkPossiblePlay(x, y) {
    if(MODE === MOVE){
        return !checkPossibleMove(x, y);
    }else {
        if (checkPossibleBuild(x, y)) return true;
    }

    return !checkPossibleMove(x, y);
}

function checkPossibleMove(x, y) {
    if (board.tiles[y][x].team !== EMPTY||board.tiles[y][x].buildType===buildType.DOME) return false;
    if (board.tiles[y][x].buildType===board.tiles[curY][curX].buildType||board.tiles[y][x].buildType===board.tiles[curY][curX].buildType+1||
        board.tiles[y][x].buildType===board.tiles[curY][curX].buildType-1) {
        board.validMoves[y][x] = VALID;
        drawCircle(x, y, HIGHLIGHT_COLOR);
        return true;
    }
}
function checkPossibleBuild(x, y) {
    if (board.tiles[y][x].team !== EMPTY||board.tiles[y][x].buildType===buildType.DOME) return false;
    
    board.validMoves[y][x] = VALID_BUILD;
    drawCorners(x, y, HIGHLIGHT_COLOR);
    return true;
}

function checkValidMovement(x, y) {
    if (board.validMoves[y][x] === VALID || board.validMoves[y][x] === VALID_BUILD) return true;
    else return false;
}

function checkValidCapture(x, y) {
    if (board.validMoves[y][x] === VALID_BUILD) return true;
    else return false;
}

function moveSelectedPiece(x, y) { 
    board.tiles[y][x].pieceType = board.tiles[curY][curX].pieceType;
    board.tiles[y][x].team = board.tiles[curY][curX].team;

    board.tiles[curY][curX].pieceType = EMPTY;
    board.tiles[curY][curX].team = EMPTY;

    curX = -1;
    curY = -1;
    board.resetValidMoves();
    MODE = BUILD;

    updateServer( board.tiles[y][x],{x:x,y:y})
}

function buildSelectedPiece(x, y) {
    board.tiles[y][x].buildType++;


    curX = -1;
    curY = -1;
    board.resetValidMoves();
    MODE = MOVE;
}

function changeCurrentTeam() {
    if (currentTeam === WHITE) {
        currentTeamText.textContent = "Blue's turn";
        currentTeam = BLACK;
    } else {
        currentTeamText.textContent = "Red's turn";
        currentTeam = WHITE;
    }
}

function repaintBoard() {
    drawBoard();
    checkPossiblePlays();
    drawPieces();
}

function drawBoard() {
    santoriniCtx.fillStyle = WHITE_TILE_COLOR;
    santoriniCtx.fillRect(0, 0, BOARD_WIDTH*TILE_SIZE, BOARD_HEIGHT*TILE_SIZE);
    
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            if ((i+j)%2 === 1) {
                drawTile(j, i, BLACK_TILE_COLOR);
            }
        }
    }
}

function drawTile(x, y, fillStyle) {
    santoriniCtx.fillStyle = fillStyle;
    santoriniCtx.fillRect(TILE_SIZE*x, TILE_SIZE*y, TILE_SIZE, TILE_SIZE);
}

function drawCircle(x, y, fillStyle) {
    santoriniCtx.fillStyle = fillStyle;
    santoriniCtx.beginPath();
    santoriniCtx.arc(TILE_SIZE*(x+0.5), TILE_SIZE*(y+0.5), TILE_SIZE/5, 0, 2*Math.PI);
    santoriniCtx.fill();
}

function drawCorners(x, y, fillStyle) {
    santoriniCtx.fillStyle = fillStyle;

    santoriniCtx.beginPath();
    santoriniCtx.moveTo(TILE_SIZE*x, TILE_SIZE*y);
    santoriniCtx.lineTo(TILE_SIZE*x+15, TILE_SIZE*y);
    santoriniCtx.lineTo(TILE_SIZE*x, TILE_SIZE*y+15);
    santoriniCtx.fill();

    santoriniCtx.beginPath();
    santoriniCtx.moveTo(TILE_SIZE*(x+1), TILE_SIZE*y);
    santoriniCtx.lineTo(TILE_SIZE*(x+1)-15, TILE_SIZE*y);
    santoriniCtx.lineTo(TILE_SIZE*(x+1), TILE_SIZE*y+15);
    santoriniCtx.fill();

    santoriniCtx.beginPath();
    santoriniCtx.moveTo(TILE_SIZE*x, TILE_SIZE*(y+1));
    santoriniCtx.lineTo(TILE_SIZE*x+15, TILE_SIZE*(y+1));
    santoriniCtx.lineTo(TILE_SIZE*x, TILE_SIZE*(y+1)-15);
    santoriniCtx.fill();

    santoriniCtx.beginPath();
    santoriniCtx.moveTo(TILE_SIZE*(x+1), TILE_SIZE*(y+1));
    santoriniCtx.lineTo(TILE_SIZE*(x+1)-15, TILE_SIZE*(y+1));
    santoriniCtx.lineTo(TILE_SIZE*(x+1), TILE_SIZE*(y+1)-15);
    santoriniCtx.fill();
}

function drawPieces() {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {

            if(board.tiles[i][j].buildType!==buildType.EMPTY){
                santoriniCtx.fillStyle = "#000" ;
                santoriniCtx.font = "38px Arial";
                let pieceType = board.tiles[i][j].buildType;
                santoriniCtx.fillText(piecesCharacters[pieceType], TILE_SIZE*(j+1/8), TILE_SIZE*(i+4/5));
            }

            if (board.tiles[i][j].team === EMPTY) continue;
            
            if (board.tiles[i][j].team === WHITE) {
                santoriniCtx.fillStyle = "#FF0000";
            } else {
                santoriniCtx.fillStyle = "#0000FF";
            }
            
            santoriniCtx.font = "38px Arial";
            let pieceType = board.tiles[i][j].pieceType;
            santoriniCtx.fillText(piecesCharacters[pieceType], TILE_SIZE*(j+1/8), TILE_SIZE*(i+4/5));
        }
    }
}




function updateTotalVictories() {
    totalVictoriesText.textContent = "Games won: white " + whiteVictories + " - black " + blackVictories;
}

function getOppositeTeam(team) {
    if (team === WHITE) return BLACK;
    else if (team === BLACK) return WHITE;
    else return EMPTY;
}

class Board {
    constructor() {
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




        this.validMoves = [];
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            this.validMoves.push([
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID

            ]);
        }
    }

    resetValidMoves() {
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            for (let j = 0; j < BOARD_WIDTH; j++) {
                this.validMoves[i][j] = INVALID;
            }
        }

    }
}

class Tile {
    constructor(pieceType, team, builType) {
        this.pieceType = pieceType;
        this.team = team;
        this.buildType = 0;
    }
}

async function updateServer (tile,pos){
    let url = `http://localhost:8000/games/`;



    let updata = {
        tile: tile,
        pos:pos
    };

    /*let cfg = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updata)
    };*/
    //console.log(cfg);



    try {
        let resp = await fetch(url);
        let data = await resp.text();
        data = JSON.parse(data);
        console.log(data);

    }
    catch (err) {
        console.log(err);
    }
}