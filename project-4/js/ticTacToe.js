const ticTacToe = (function() {

	// Declare variables
	const $start = $( '#start' ),
		  $board = $( '#board' ),
			$finish = $( '#finish' ),
		  $boxes = $board.find( ".boxes .box" ),
		  $startBtn = $start.find( 'a.button' ),
		  $playerNames = $start.find( '.player-name' ),
		  $player1Scorecard = $board.find( '#player1' ),
		  $player2Scorecard = $board.find( '#player2' ),
		  players = [];

	let activePlayer = {},
			gameState = [];

	/**
	 * Function used to load the game's start screen
	 */
	const loadGame = () => {
		$board.hide();
		$finish.hide();
		$start.hide().fadeIn('slow');
		// $start.hide();
		// $board.hide().fadeIn('slow');
	}

	/**
	 * This function is used to determine if the game is complete
	 * aka if every box has been checked
	 * @param  {array} gameState [array representation of the game board]
	 * @return {string}           [string indicating whether the game is complete or incomplete]
	 */
	const checkGameCompletion = (gameState) => {
		let state = "incomplete";
		const arr = gameState.reduce((acc, cur) => {
			return acc.concat(cur);
		})

		if ( !arr.some((a) => a === "unchecked") ) {
			state = "complete";
		}
		return state;
	}

	/**
	 * This function is used to set and maintain the state of the game
	 * and keep track of the game score
	 * @return {array} const [array containing representation of game board state]
	 */
	const setGameState = () => {
		let arr = [];
		$boxes.each(function(k) {
				arr.push( $( this ).attr("data-value") );
		})

		let row1 = arr.filter((v,k) => k < 3 );
		let row2 = arr.filter((v,k) => k >= 3 && k < 6 );
		let row3 = arr.filter((v,k) => k >= 6 && k < 9 );
		return [row1,row2,row3];
	}

	/**
	 * This function is used to evalute the current state of the game board
	 * @param  {[type]} gameState [array representation of the game board]
	 * @return {[type]}           [description]
	 */
	const evaluateGameState = (gameState) => {
		const rowChecks = gameState.map((row) => checkRow(row)),
					cols = colsToRows(gameState),
					colChecks = cols.map((row) => checkRow(row)),
					diagonals = diagonalsToRows(gameState),
					diagonalChecks = diagonals.map((row) => checkRow(row));

		// Combine all checks into one array
		const evaluatedGameState = rowChecks.concat(colChecks,diagonalChecks);

		// Check if a player has won
		if ( evaluatedGameState.includes("X wins") ) {
			alert("X Wins. Game over");
		} else if ( evaluatedGameState.includes("O wins") ) {
			alert("O Wins. Game over");
		} else if ( checkGameCompletion(gameState) === "complete" ) {
			alert("Draw. Game over");
		}
	}

	/**
	 * This function is used to check if a game board row contains 3 Xs or 3 Os
	 * @param  {array} row [array representing game board row]
	 * @return {boolean}     [boolean indicating whether 3 Xs or 3 Os were found]
	 */
	const checkRow = (row) => {
		let state;

		if ( row.every((box) => box === "x") ) {
			state = "X wins";
		} else if ( row.every((box) => box === "o") ) {
			state = "O wins";
		} else {
			state = false;
		}
		return state;
	}

	/**
	 * This function is used to convert the game board columns to rows
	 * @param  {array} row [array representation of the game board]
	 * @return {array}     [returns the game state but transposed]
	 */
	const colsToRows = (gameState) => {
		let rows = [],
				col1 = [],
				col2 = [],
				col3 = [];

		gameState.forEach((v,k) => {
			col1.push(v.filter((row, index) => index === 0)[0]);
			col2.push(v.filter((row, index) => index === 1)[0]);
			col3.push(v.filter((row, index) => index === 2)[0]);
		});
		rows = [col1,col2,col3];
		return rows;
	}

	/**
	 * This function is used to convert the game board diagonals to rows
	 * @param  {array} row [array representation of the game board]
	 * @return {array}     [returns the game state but transposed]
	 */
	const diagonalsToRows = (ganeState) => {
		let rows = [],
				diagonal1 = [],
				diagonal2 = [];

		// Create first diagonal array
		gameState.forEach((v,k) => {
			diagonal1.push(v[k]);
		});

		// Create second diagonal array
		gameState.forEach((v,k) => {
			diagonal2.push(v[(gameState.length - 1) - k]);
		});

		rows = [diagonal1, diagonal2];
		return rows;
	}

	/**
	 * Function used to start the game when the user clicks the start button
	 * Calls the createPlayers function to create game players
	 */
	const startGame = () => {
		createPlayers();
		$start.fadeOut();
		$board.fadeIn();
		initializeBoard();
	}

	/**
	 * This function is used to create the game's players
	 */
	const createPlayers = () => {
		$playerNames.each((k,v) => {
			players.push({
				name: $( v ).val(),
				symbol: $( v ).attr("symbol"),
				playerNo: k+1
			})
		})
		players[0].symbolClassHollow = "box-hollow-1";
		players[1].symbolClassHollow = "box-hollow-2";
		players[0].symbolClassFilled = "box-filled-1";
		players[1].symbolClassFilled = "box-filled-2";
	}

	/**
	 * This function is used to set the initial board state
	 * @return {[type]} [description]
	 */
	const initializeBoard = () => {
		$player1Scorecard.addClass("active");
		$player1Scorecard.find( ".player-name-label" ).text(players[0].name );
		$player2Scorecard.find( ".player-name-label" ).text(players[1].name );
		$boxes.each(function() {
			$( this ).attr("data-value", "unchecked");
		})
		activePlayer = players[0];
	}

	/**
	 * This function is used to toggle the active player based on whose turn it is
	 */
	const switchPlayer = () => {
		if (activePlayer.playerNo === 1) {
			activePlayer = players[1];
			$player1Scorecard.removeClass("active");
			$player2Scorecard.addClass("active");
		} else {
			activePlayer = players[0];
			$player2Scorecard.removeClass("active");
			$player1Scorecard.addClass("active");
		}
	}

	/**
	 * This function is to used to set the box state of a box
	 * There is different logic for hover and click events
	 * @param  {object} e [JavaScript event object]
	 */
	const setBoxState = (e) => {
		const $target = $( e.target ),
			  type = e.type.toLowerCase();

		if ( type === "mouseover" && !$target.hasClass('box-filled') ) {
			$target.addClass( activePlayer.symbolClassHollow );
		} else if ( type === "mouseout"  && !$target.hasClass('box-filled')) {
			$target.removeClass( activePlayer.symbolClassHollow );
		}

		// check to see if box has already been selected
		if ( type === "click" && !$target.hasClass('box-filled')) {
			$target.removeClass( activePlayer.symbolClassHollow );
			$target.addClass( activePlayer.symbolClassFilled );
			$target.addClass( 'box-filled' );
			$target.attr("data-value", activePlayer.symbol);
			gameState = setGameState();
			evaluateGameState(gameState);
			switchPlayer();
		}
	}

	/**
	 * This function is used to bind all events for the game
	 */
	const bindEvents = (() => {
		$startBtn.on("click", startGame);
		$boxes.on("click mouseover mouseout", setBoxState);
	})();

	// Return public methods and properties
	return {
		loadGame: loadGame,
		startGame: startGame
	}
})();
