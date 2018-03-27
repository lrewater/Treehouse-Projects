const ticTacToe = (function() {

	// Declare variables
	const $start = $( '#start' ),
		  $board = $( '#board' ),
		  $startBtn = $start.find( 'a.button' ),
		  $playerNames = $start.find( '.player-name' ),
		  $player1Scorecard = $board.find( '#player1' ),
		  $player2Scorecard = $board.find( '#player2' ),
		  $boxes = $board.find( ".boxes .box" ),
		  players = [];

	let activePlayer = {};

	/**
	 * Function used to load the game's start screen
	 */
	const loadGame = () => {		
		$board.hide();
		$start.hide().fadeIn('slow');
		//$start.hide();
		//$board.hide().fadeIn('slow');
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

		if ( type === "mouseover" ) {
			$target.addClass( activePlayer.symbolClassHollow );
		} else if ( type === "mouseout" ) {
			$target.removeClass( activePlayer.symbolClassHollow );
		}

		if ( type === "click" ) {
			$target.addClass( activePlayer.symbolClassFilled );
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