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
				url: url + "/users/me/games" + token,
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
	self.newGame = function (AI) {
		if (AI) {
			//request new ai game
			$.ajax({
				url: url + "/games/AI" + token,
				success: function (result) {
					self.getGames();
				}
			});
		} else {
			//request normal game.
			$.ajax({
				url: url + "/games" + token,
				success: function (result) {
					self.getGames();
				}
			});
		}
	}

	self.deleteGames = function () {
		$.ajax({
			url: url + "/users/me/games" + token,
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