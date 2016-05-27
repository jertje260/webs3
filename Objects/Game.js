function Game(id, status, eID, eName) {
	self = this;
	self.id = id;
	self.status = status;
	self.enemyID = eID;
	self.enemyName = eName;
	self.yourTurn;
	self.youWon;
	self.isDone;
	self.board;

	self.loadMoreInfo = function (id) {
		self.id = id;
		var ajax = {};
		ajax.url = url + "/games/" + self.id + token;
		ajax.success =
			function (result) {
				console.log(result);
				self.status = result.status;
				self.enemyID = result.enemyId;
				self.enemyName = result.enemyName;
				self.yourTurn = result.yourTurn;
				self.youWon = result.youWon;
				console.log(self);
				self.load();
				self.board.loadObjects(result.myGameboard, result.enemyGameboard);
				if (result.status == "started") {


					// load/save ships, shot and hits and enemy shots, load board to play on.
				} else if (result.status == "queue") {
					//decide what to show, game is still in queue, so no enemy

				} else if (result.status == "setup") {
					// load board with ships and show for setup

					self.yourTurn = result.yourTurn;
				} else if (result.status == "done") {
					// load board and show winner
					self.isDone = true;
				}
			};
			if(self.shouldPoll()){
				console.log('polling on game');
				ajax.timeout = 5000;
			}
		$.ajax(ajax);
	}

	self.shouldPoll = function () {
		// polling if game has started and its not your turn, or if game is in setup, and you placed your ships
		if (self.board != null){
			if (self.status == "setup" && self.board.placedShips.length == self.board.ships.length) {
				return true;
			}
		}
		if (!self.yourTurn && self.status == "started") {
			return true;
		}
		return false;
	}
	self.load = function () {
		console.log("loading game" + self.id);
		if (self.board == null) {
			self.board = new Board(self);
		}
		if (!$('#gamepage').is(':visible')) {
			hideAndShow("#mygamespage", "#gamepage");
		}
	}



}