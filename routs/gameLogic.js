//-------------------------------------------------------------------------------------
//------ Objects ----------------------------------------------------------------------
//-------------------------------------------------------------------------------------

let OTurnState = {
    move:0,
    build:1
}

//-------------------------------------------------------------------------------------
//------ Classes ----------------------------------------------------------------------
//-------------------------------------------------------------------------------------

function TBuilder () {
    this.field = null;

}

function TPlayer (player) {
    this.player = player
    this.builder1
    this.builder2
}

function TGame (host,secondPlayer) {
    this.playerOne = new TPlayer(host);
    this.playerTwo = new TPlayer(secondPlayer);
    this.turn = 0;
    this.turnState = OTurnState.move
}

//-------------------------------------------------------------------------------------
//------ Global Variables -------------------------------------------------------------
//-------------------------------------------------------------------------------------

let game = null;

//-------------------------------------------------------------------------------------
//------ Main code --------------------------------------------------------------------
//-------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------
//------ Functions --------------------------------------------------------------------
//-------------------------------------------------------------------------------------

function startNewGame (host,sencondPlayer) {
    game = new TGame(host,secondPlayer);
}

//-------------------------------------------------------------------------------------
//------ Events -----------------------------------------------------------------------
//-------------------------------------------------------------------------------------