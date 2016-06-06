function Game(id, status, eID, eName, ctrl) {
	self = this;
	self.id = id;
	self.status = status;
	self.enemyID = eID;
	self.enemyName = eName;
	self.yourTurn;
	self.youWon;
	self.isDone;
	//self.board = null;
	self.placedShips = [];
	self.ships = [];
	self.shipsPlaced = false;
	self.shots = [];
	self.enemyShots = [];
	self.fields = [];
	self.shipsToPlace = [];



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
					self.status = result.status;
					//self.loadShips();
					// if (self.board == null) {
					// 	self.board = new Board(self);
					// }
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
					ctrl.app.createPopup("Error!", result.msg, function () {

						var href = location.pathname + "?page=games";
						history.pushState({ "URL": href, "toLoad": href, }, 'New URL: ' + href, href);
						ctrl.app.loadFromUrl();
					});
				}
			};



		$.ajax(ajax);
	}

    self.loadField = function () {
        for (j = 0; j < 10; j++) {
            self.fields[ctrl.letters[j]] = new Array(10);

            for (i = 0; i < 10; i++) {
                self.fields[ctrl.letters[j]][i] = new Field(ctrl.letters[j], (i + 1));
            }
        }

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

        console.log(myboard); // contains shots from enemy at me
        //console.log(enemyboard); // contains my shots
        //console.log(self.game);
        if (self.status == "setup" && myboard != undefined && myboard.ships.length == 5) {
            shipsPlaced = true;
        }

        if (myboard != undefined) {
            if (myboard.ships.length > 0) {
                self.ships = [];
                self.placedShips = [];

				for (var i = 0; i < myboard.ships.length; i++) {
					var s = new Ship(myboard.ships[i]._id, myboard.ships[i].name, myboard.ships[i].length, !myboard.ships[i].isVertical);
					s.x = myboard.ships[i].startCell.x.toUpperCase();
					s.y = myboard.ships[i].startCell.y;
					s.hits = myboard.ships[i].hits;
					self.ships.push(s)
					self.placedShips.push(s);

				}
			}

            //console.log(self.ships);
            if (enemyboard != null && enemyboard.shots != null) {
                self.shots = enemyboard.shots;
            }
            if (myboard.shots != null) {
                self.enemyShots = myboard.shots;
            }
            //console.log(self.shots);
            //console.log(self.enemyshots);
            // self.visualizeAllShots();
            // for (i = 0; i < self.placedShips.length; i++) {
            //     self.drawOutline(i);
            //     self.drawShipName(i);
            // }

        } else {
			self.loadShips();
		}
        // if (self.game.status == "setup" && self.placedShips.length < 5) {
        //     self.loadShips();

        //     $('#shipDisplay').show();
        // } else {
        //     $('#shipDisplay').hide();
        // }
		//TODO change to sockets
        if (self.shouldPoll()) {
            console.log("polling")
            //poller = setTimeout(function () { self.game.loadMoreInfo(self.game.id) }, 5000);
        }
    }

	self.loadShips = function () {
        self.ships = [];
        self.placedShips = [];
        $.ajax({
            url: url + "/ships" + token,
            success: function (result) {
                for (i = 0; i < result.length; i++) {
                    self.ships.push(new Ship(result[i]._id, result[i].name, result[i].length, true))

                }
				ctrl.draw();
            }
        });
    }

    self.addShip = function (ship, x, y) {
        if (self.placedShips.indexOf(ship) != -1) {
            var index = self.placedShips.indexOf(ship);
            ctrl.ChangeFields(self.placedShips[index], false);
            self.placedShips[index].x = x;
            self.placedShips[index].y = y;
            ctrl.ChangeFields(self.placedShips[index], true);
        } else {
            var index = self.ships.indexOf(ship);
            self.ships[index].x = x;
            self.ships[index].y = y;
            self.placedShips.push(self.ships[index]);
            ctrl.ChangeFields(self.ships[index], true);
        }
    }

}