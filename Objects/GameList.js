function GameList() {
	var self = this;
	self.games = [];
	self.loadingGames = false;
	self.currentGame;
	self.getGames = function () {
		if (!self.loadingGames) {
			self.loadingGames = true
			self.games = [];
			$.ajax({
				url: url + "/users/me/games" + token,
				success: function (result) {
					for (i = 0; i < result.length; i++) {
						console.log(result[i]);
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
	}

	self.deleteGames = function(){
		$.ajax({
			url: url + "/users/me/games" + token,
			method: "DELETE",
			success: function(result){
				self.getGames();
			}
		});
	}


	self.viewGames = function () {
		$('#allGames tbody').empty();
		//$('#allGames tbody').append('<th>Game ID</th><th>Status</th><th>Enemy name</th>');
		for (i = 0; i < self.games.length; i++) {
			$('#allGames tbody').append('<tr id="' + self.games[i].id + '"><td>' + self.games[i].id + '</td><td>' + self.games[i].status + '</td><td>' + self.games[i].enemyName + '</td></tr>');
		}
		$('#allGames tbody tr').on('click', function (event) {
			var id = event.currentTarget.id;
			//load this game
			self.currentGame = self.findGame(id);
			if (self.currentGame != null) {
				console.log(self.currentGame.id);
				self.currentGame.loadMoreInfo();

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
	
	//code to execute on load
	self.getGames();
	$('#newGame').on('click', function () {
		self.newGame(false);
	});
	$('#newAIGame').on('click', function () {
		self.newGame(true);
	});
	$('#deleteGames').on('click', function(){
		self.deleteGames();
	});
}