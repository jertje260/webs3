function GameList() {
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
					self.viewGames();
					self.loadingGames = false;
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
	};
	self.getGames();


	self.viewGames = function () {
		$('#allGames tbody').empty();
		//$('#allGames tbody').append('<th>Game ID</th><th>Status</th><th>Enemy name</th>');
		for (i = 0; i < self.games.length; i++) {
			$('#allGames tbody').append('<tr id="' + self.games[i].id + '"><td>' + self.games[i].id + '</td><td>' + self.games[i].status + '</td><td>' + self.games[i].enemyName + '</td></tr>');
		}
		$('#allGames tbody tr').on('click', function () {
			var index = this.rowIndex;
			console.log(self.games[index - 1]);
			//load this game
			if (self.games[index - 1] != undefined) {
				self.games[index - 1].loadMoreInfo();
				self.games[index - 1].load();
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

	$('#newGame').on('click', function () {
		self.newGame(false);
	});
	$('#newAIGame').on('click', function () {
		self.newGame(true);
	});
}