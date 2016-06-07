function GameList(ctrl) {
	

	//events
	// $('#allGames').on('click', 'tr', function (event) {
	// 	href = $(this).attr("href");
    //     loadContent(href);

    //     // HISTORY.PUSHSTATE
    //     history.pushState('', 'New URL: ' + href, href);
    //     event.preventDefault();


	// });

	var self = this;
	self.games = [];
	self.loadingGames = false;
	self.getGames = function () {
		if (!self.loadingGames) {
			self.loadingGames = true
			self.games = [];
			$.ajax({
				url: ctrl.app.config.url + "/users/me/games" + ctrl.app.config.token,
				success: function (result) {
					for (i = 0; i < result.length; i++) {
						self.games.push(new Game(result[i]._id, result[i].status, result[i].enemyId, result[i].enemyName));
					}
					self.loadingGames = false;
					ctrl.draw();
				}
			});
		}
	}

	self.hasGameWaiting = function () {
		for (var i = 0; i < self.games.length; i++){
			if (self.games[i].status == "queue") {
				return true;
			}
		}
		return false;
}
	self.newGame = function (AI) {
		if (AI) {
			//request new ai game
			$.ajax({
				url: ctrl.app.config.url + "/games/AI" + ctrl.app.config.token,
				success: function (result) {
					self.getGames();
				}
			});
		} else {
			//request normal game.
			$.ajax({
				url: ctrl.app.config.url + "/games" + ctrl.app.config.token,
				success: function (result) {
					self.getGames();
				}
			});
		}
	}

	self.deleteGames = function () {
		$.ajax({
			url: ctrl.app.config.url + "/users/me/games" + ctrl.app.config.token,
			method: "DELETE",
			success: function (result) {
				self.getGames();
			}
		});
	}



	self.findGame = function (id) {
		for (i = 0; i < self.games.length; i++) {
			if (self.games[i].id == id) {
				return self.games[i];
			}
		}
		return null;
	}

	

	// $('#newGame').on('click', function () {
	// 	self.newGame(false);
	// });
	// $('#newAIGame').on('click', function () {
	// 	self.newGame(true);
	// });
	// $('#deleteGames').on('click', function () {
	// 	self.deleteGames();
	// });
}