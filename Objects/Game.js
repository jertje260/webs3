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
					self.loadObjects(result.myGameboard, result.enemyGameboard);
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

 self.loadObjects = function (myboard, enemyboard) {

        //console.log(myboard); // contains shots from enemy at me
        //console.log(enemyboard); // contains my shots
        //console.log(self.game);
        if (self.status == "setup" && myboard != undefined && myboard.ships.length == 5) {
            shipsPlaced = true;
        }
        var text = "You are playing versus " + self.game.enemyName + ". It's ";
        if (self.game.yourTurn) {
            text += "your";
        } else {
            text += "his";
        }
        text += " turn.";
        $('#enemyText')[0].innerHTML = text;

        if (myboard != undefined) {
            if (myboard.ships.length > 0) {
                self.ships = [];
                self.placedShips = [];
            }
            for (i = 0; i < myboard.ships.length; i++) {
                var s = new Ship(myboard.ships[i]._id, myboard.ships[i].name, myboard.ships[i].length, !myboard.ships[i].isVertical);
                s.x = myboard.ships[i].startCell.x.toUpperCase();
                s.y = myboard.ships[i].startCell.y;
                s.hits = myboard.ships[i].hits;
                self.ships.push(s)
                self.placedShips.push(s);

            }

            //console.log(self.ships);
            if (enemyboard != null && enemyboard.shots != null) {
                self.shots = enemyboard.shots;
            }
            if (myboard != null && myboard.shots != null) {
                self.enemyshots = myboard.shots;
            }
            //console.log(self.shots);
            //console.log(self.enemyshots);
            self.visualizeAllShots();
            for (i = 0; i < self.placedShips.length; i++) {
                self.drawOutline(i);
                self.drawShipName(i);
            }

        }
        if (self.game.status == "setup" && self.placedShips.length < 5) {
            self.loadShips();

            $('#shipDisplay').show();
        } else {
            $('#shipDisplay').hide();
        }

        if (self.game.shouldPoll()) {
            console.log("polling")
            poller = setTimeout(function () { self.game.loadMoreInfo(self.game.id) }, 5000);
        }
    }


}