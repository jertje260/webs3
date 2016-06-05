function Game(id, status, eID, eName, ctrl) {
	self = this;
	self.id = id;
	self.status = status;
	self.enemyID = eID;
	self.enemyName = eName;
	self.yourTurn;
	self.youWon;
	self.isDone;
	self.board = null;
	
	

	self.loadMoreInfo = function (id) {
		self.id = id;
		var ajax = {};
		ajax.url = url + "/games/" + self.id + token;
		ajax.success =
			function (result) {
				console.log(result);
				if (!result.msg) {
					self.status = result.status;
					self.enemyID = result.enemyId;
					self.enemyName = result.enemyName;
					self.yourTurn = result.yourTurn;
					self.youWon = result.youWon;

					if (self.board == null) {
						self.board = new Board(self);
					}
					self.board.loadObjects(result.myGameboard, result.enemyGameboard);
					console.log(self);
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
					ctrl.draw();
				} else {
					createPopup("Error!", result.msg, function () {

						var href = location.pathname + "?page=games";
						console.log("pushing state back " + href);

						history.pushState({ "URL": href, "toLoad": href, }, 'New URL: ' + href, href);
						loadContent(href);
					});
				}
			};



		$.ajax(ajax);
	}

	self.shouldPoll = function () {
		// polling if game has started and its not your turn, or if game is in setup, and you placed your ships
		if (self.board != null) {
			if (self.status == "setup" && self.board.shipsPlaced) {
				return true;
			}
		}
		if (!self.yourTurn && self.status == "started") {
			return true;
		}
		return false;
	}




}