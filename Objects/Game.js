function Game(id, status, eID, eName) {
	self = this;
	self.id = id;
	self.status = status;
	self.enemyID = eID;
	self.enemyName = eName;
	self.yourTurn;
	self.youWon;
	self.board;

	self.loadMoreInfo = function () {
		console.log(self.id);
		$.ajax({
			url: url + "/games/" + self.id + token,
			success: function (result) {
				console.log(result);
				if (result.status == "started") {
					self.yourTurn = result.yourTurn;
					// load/save ships, shot and hits and enemy shots, load board to play on.
				} else if (result.status == "queue") {
					//decide what to show, game is still in queue, so no enemy
					self.board.loadObjects(result.myGameboard, result.enemyGameboard);
				} else if (result.status == "setup") {
					// load board with ships and show for setup
					self.board.loadObjects(result.myGameboard, result.enemyGameboard);
					self.yourTurn = result.yourTurn;
				} else if (result.status == "done") {
					// load board and show winner
					self.board.loadObjects(result.myGameboard, result.enemyGameboard);
					self.youWon = result.youWon;
				}
			}
		});
	}
	self.load = function () {
		console.log("loading game" + self.id);
		self.board = new Board(self);
		hideAndShow("#mygamespage", "#gamepage");
	}

	

}