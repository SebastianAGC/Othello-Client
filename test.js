var URL = "http://localhost:4000"
var tID = 12
var usr = 'ReiserBleid'
var moves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
var tileRep = ['_', 'X', 'O'], N = 8;
var cont = 0;

function ix(row, col){
  return (row - 1) * N + 'abcdefgh'.indexOf(col);
}

function randInt(a, b){
  return parseInt(Math.floor(Math.random()*(b-a+1)+a));
}

function humanBoard(board){

  var result = '    A  B  C  D  E  F  G  H';

  for(var i = 0; i < board.length; i++){
    if(i % N === 0){
      result += '\n\n ' + (parseInt(Math.floor(i / N)) + 1) + ' ';
    }

    result += ' ' + tileRep[board[i]] + ' ';
  }

  return result;
}

function validateHumanPosition(position){
  var validated = position.length === 2;

  if(validated){
    var row = parseInt(position[0]),
        col = position[1].toLowerCase();

    return (1 <= row && row <= N) && ('abcdefgh'.indexOf(col) >= 0);
  }

  return false;
}

function validateMove(board, tile, x, y){
	let index = x * N + y;
    if(board[index] != 0 || !isOnBoard(x, y)){
        return [false];
    }

    let testboard = Object.assign([], board);
    testboard[index] = tile;

    let otherTile = 1;

    if(tile == 1){
        otherTile = 2;
    }

    let tilesToFlip = [];

    let options = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];

    for(var op in options){

    	let xd = options[op][0];
    	let yd = options[op][1];
    	let i = x
    	let j = y
    	
        i += xd;
        j += yd;

        if(isOnBoard(i, j) && testboard[i*N+j] == otherTile){
        	i += xd
            j += yd

            if(!isOnBoard(i, j)){
                continue
            }
            while(testboard[i * N + j] == otherTile){
            	i += xd;
                j += yd;
                if(!isOnBoard(i, j)){
                    break;
                }
            }
                
            if(!isOnBoard(i, j)){
                continue;
            }

            if(testboard[i * N + j] == tile){
                while(true){
                	i -= xd;
                    j -= yd;
                    if(i == x && j == y){
                        break;
                    }
                    tilesToFlip.push([i, j]);
                }    
            }
        }         
    }
    return [true, tilesToFlip];
}


function isOnBoard(x, y){
	if(-1 < x < 8 && -1 < y < 8){
		return true;
	}
	return false;
}

function heuristic(gameBoard, player){
	let playerPieces = 0

	cornerBonus = 10
	riskArea = 4

	//checking corners
	if (gameBoard[0] == player) playerPieces += cornerBonus
    if (gameBoard[7] == player) playerPieces += cornerBonus
    if (gameBoard[56] == player) playerPieces += cornerBonus
    if (gameBoard[63] == player) playerPieces += cornerBonus

    //checking risk areas
    if(gameBoard[1] == player) playerPieces -= riskArea
    if(gameBoard[6] == player) playerPieces -= riskArea
    if(gameBoard[8] == player) playerPieces -= riskArea
    if(gameBoard[9] == player) playerPieces -= riskArea
   	if(gameBoard[14] == player) playerPieces -= riskArea
   	if(gameBoard[15] == player) playerPieces -= riskArea 
   	if(gameBoard[48] == player) playerPieces -= riskArea
   	if(gameBoard[49] == player) playerPieces -= riskArea
    if(gameBoard[54] == player) playerPieces -= riskArea
    if(gameBoard[55] == player) playerPieces -= riskArea
    if(gameBoard[57] == player) playerPieces -= riskArea
    if(gameBoard[62] == player) playerPieces -= riskArea    
}


function evaluateBoard(gameBoard, player) {
    let player1Pieces = 0;
    let player2Pieces = 0;

    //for cicle that counts the amount of pieces per player
    gameBoard.forEach(function(element){
    	if(element == 1){
    		player1Pieces++;
    	}else{
    		player2Pieces++;
    	}
    })

    const cornerBonus = 10
    //checking corners
	if (gameBoard[0] == 1) player1Pieces += cornerBonus
    if (gameBoard[7] == 1) player1Pieces += cornerBonus
    if (gameBoard[56] == 1) player1Pieces += cornerBonus
    if (gameBoard[63] == 1) player1Pieces += cornerBonus

    //checking corners
	if (gameBoard[0] == 2) player2Pieces += cornerBonus
    if (gameBoard[7] == 2) player2Pieces += cornerBonus
    if (gameBoard[56] == 2) player2Pieces += cornerBonus
    if (gameBoard[63] == 2) player2Pieces += cornerBonus

    player1Pieces += heuristic(1);
    player2Pieces += heuristic(2);

    if(player == 1){
    	return player2Pieces - player1Pieces;
    }else{
    	return player1Pieces - player2Pieces;
    }
}

function processMove(gameBoard, move, playerTurnID){
	const processBoard = Object.assign([], gameBoard)
	let x = move[0]
	console.log("X = " + x)
	let y = move[1]
	console.log("Y = " + y)
	let tilesToFlip = move[2]
	console.log("TilesToFlip")
	console.log(tilesToFlip)

	let index = x * N + y
	processBoard[index] = playerTurnID

	for(tile in tilesToFlip){
		index = tilesToFlip[tile][0] * N + tilesToFlip[tile][1]
		processBoard[index] = playerTurnID
	}
	return processBoard;
}

function generateMoves(gameBoard, playerTurnID){
	let possibleMoves = []
	const generateBoard = Object.assign([], gameBoard)
	const reshapedBoard = reshapeBoard(gameBoard)

    for(let x = 0; x < reshapedBoard.length; x++){
    	for(let y = 0; y < reshapedBoard[x].length; y++){
    		let move = validateMove(generateBoard, playerTurnID, x, y);
    		if(move[0]){ //posible movimiento
    			if(move[1].length != 0){
    				possibleMoves.push([x, y, move[1]]);
    			}
    		}
    	}
    }
    return possibleMoves;
}

function reshapeBoard(gameBoard){
	var a = [ gameBoard[0],  gameBoard[1],  gameBoard[2],  gameBoard[3],  gameBoard[4],  gameBoard[5],  gameBoard[6],  gameBoard[7]];
	var b = [ gameBoard[8],  gameBoard[9], gameBoard[10], gameBoard[11], gameBoard[12], gameBoard[13], gameBoard[14], gameBoard[15]];
	var c = [gameBoard[16], gameBoard[17], gameBoard[18], gameBoard[19], gameBoard[20], gameBoard[21], gameBoard[22], gameBoard[23]];
	var d = [gameBoard[24], gameBoard[25], gameBoard[26], gameBoard[27], gameBoard[28], gameBoard[29], gameBoard[30], gameBoard[31]];
	var e = [gameBoard[32], gameBoard[33], gameBoard[34], gameBoard[34], gameBoard[36], gameBoard[37], gameBoard[38], gameBoard[39]];
	var f = [gameBoard[40], gameBoard[41], gameBoard[42], gameBoard[43], gameBoard[44], gameBoard[45], gameBoard[46], gameBoard[47]];
	var g = [gameBoard[48], gameBoard[49], gameBoard[50], gameBoard[51], gameBoard[52], gameBoard[53], gameBoard[54], gameBoard[55]];
	var h = [gameBoard[56], gameBoard[57], gameBoard[58], gameBoard[59], gameBoard[60], gameBoard[61], gameBoard[62], gameBoard[63]];

	var board = [a, b, c, d, e, f, g, h];

	return board;
}


function isBoardFull(gameBoard){
	//for cicle that counts the amount of pieces per player
    if(gameBoard.indexOf(0) === -1){
    	return true
    }
    return false
}

var bestCoordinate = null;

function minimax(gameBoard, depth, maximizingPlayer, playerTurnID, opponentID) {
	let moves = []
    //Calcuting possible moves
    if(maximizingPlayer){
    	moves = generateMoves(gameBoard, playerTurnID);
    }else{
    	moves = generateMoves(gameBoard, opponentID);
    }

    //Checking ending conditions
    if (depth == 0 || isBoardFull(gameBoard) || moves.length == 0 ){
        return evaluateBoard(gameBoard, playerTurnID);
    }

    //Cloning board
    let newBoard = Object.assign([], gameBoard);

    if (maximizingPlayer) {
        let bestValue = Number.MIN_SAFE_INTEGER;
        moves.forEach(function(element){
        	newBoard = processMove(gameBoard, element, playerTurnID)
        	let v = minimax(newBoard, depth - 1, true, playerTurnID, opponentID)
        	if(v > bestValue){
        		bestValue = v
        		bestCoordinate = element
        	}
	    })
        return bestValue;
    }
    else 
    {
        let bestValue = Number.MAX_SAFE_INTEGER;
        moves.forEach(function(element){
        	newBoard = processMove(gameBoard, element, opponentID)
        	let v = minimax(newBoard, depth - 1, false, playerTurnID, opponentID)
        	if(v < bestValue){
        		bestValue = v
        		bestCoordinate = element
        	}
        })
        return bestValue;
    }
}



console.log("Starting socket connection...")
console.log("Connecting to url: " + URL)

var io = require('socket.io-client')  // for example: http://127.0.0.1:3000
var socket = io.connect(URL), userName = usr + randInt(1, 100), tournamentID = tID;

socket.on('connect', function(){
  console.log("Connecting user " + userName)

  socket.emit('signin', {
    user_name: userName,
    tournament_id: tournamentID,
    user_role: 'player'
  });
});

socket.on('ok_signin', function(){
  console.log("Successfully signed in!");
});

socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;

  console.log(playerTurnID)
  console.log(humanBoard(board))

  // Calculate move
  var opponentID = 1
  if(playerTurnID == 1) opponentID = 2
  minimax(board, 1, true, playerTurnID, opponentID);
  if(bestCoordinate != null){
  	  socket.emit('play', {
	    tournament_id: tournamentID,
	    player_turn_id: playerTurnID,
	    game_id: gameID,
	    movement: bestCoordinate[0] * N + bestCoordinate[1]
	  }); 
  }

});


socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;
  
  // The game has finished
  console.log("Game " + data.game_id + " has finished");

  // Inform my students that there is no rematch attribute
  console.log("Ready to play again!");

  // Start again!
  
  socket.emit('player_ready', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});