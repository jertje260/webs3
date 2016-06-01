function GameList(show) {
	

	//events
	$('#allGames').on('click', 'tr', function (event) {
		href = $(this).attr("href");
        loadContent(href);

        // HISTORY.PUSHSTATE
        history.pushState('', 'New URL: ' + href, href);
        event.preventDefault();


	});

	var self = this;
	self.games = [];
	self.loadingGames = false;
	self.getGames = function (show) {
		if(show == undefined){
			show = true;
		}
		if (!self.loadingGames) {
			self.loadingGames = true
			self.games = [];
			$.ajax({
				url: url + "/users/me/games" + token,
				success: function (result) {
					for (i = 0; i < result.length; i++) {
						self.games.push(new Game(result[i]._id, result[i].status, result[i].enemyId, result[i].enemyName));
					}
					if (show) {
						self.viewGames();
					}
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

	self.deleteGames = function () {
		$.ajax({
			url: url + "/users/me/games" + token,
			method: "DELETE",
			success: function (result) {
				self.getGames();
			}
		});
	}


	self.viewGames = function () {
		$('#allGames tbody').empty();
		//$('#allGames tbody').append('<th>Game ID</th><th>Status</th><th>Enemy name</th>');
		for (i = 0; i < self.games.length; i++) {
			$('#allGames tbody').append('<tr href="/webs3/?page=game&id=' + self.games[i].id + '" id="' + self.games[i].id + '"><td>' + self.games[i].id + '</td><td>' + self.games[i].status + '</td><td>' + self.games[i].enemyName + '</td></tr>');
		}
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
	if(show == undefined){
			self.getGames(true);
	} else {
		self.getGames(false);
	}

	$('#newGame').on('click', function () {
		self.newGame(false);
	});
	$('#newAIGame').on('click', function () {
		self.newGame(true);
	});
	$('#deleteGames').on('click', function () {
		self.deleteGames();
	});
}