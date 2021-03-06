function GamelistCtrl(app) {
    var self = this;
    self.gamelist;
    self.app = app;


    self.load = function () {
        app.loadPage(app.pagelist["/webs3/" + location.search], function () {
            document.title = "BattleShip - GameList";
            self.gamelist = new GameList(self);
            self.gamelist.getGames();
            self.bindEvents();

        });
    }


    self.bindEvents = function () {
        $('#allGames').on('click', 'tr', function (event) {

            href = $(this).attr("href");
            id = href.split('id=')[1];
            var game = self.gamelist.findGame(id);
            if (game.status == "queue") {
                // show popup
                app.createPopup("Game state", "You cannot open this game, it's still in the queue, so you cannot do anything.");
            } else {
                app.setCtrl(new GameCtrl(app, id));

                // HISTORY.PUSHSTATE
                history.pushState('', 'New URL: ' + href, href);
            }
            event.preventDefault();
        });

        $('#newGame').on('click', function () {
            self.gamelist.newGame(false);
        });
        $('#newAIGame').on('click', function () {
            self.gamelist.newGame(true);
        });
        $('#deleteGames').on('click', function () {
            self.gamelist.deleteGames();
        });

    }
    self.disableNewGame = function () {
        if (self.gamelist.hasGameWaiting()) {
            $('#newGame').addClass('btn-disabled');
            $('#newGame').attr('disabled', 'disabled');
            $('#newGame').prop('disabled', true);
        }
    }


    self.turnUpdate = function (turn) {
        self.gamelist.findGame(turn.gameId).yourTurn = turn.turn;
        self.draw();
    }

    self.gameUpdate = function (update) {
        console.log(update);
        self.gamelist.getGames();
        self.draw();
    }

    self.draw = function () {
        console.log(self.gamelist);
        self.disableNewGame();
        $('#allGames tbody').empty();
        for (i = 0; i < self.gamelist.games.length; i++) {
            $('#allGames tbody').append('<tr href="/webs3/?page=game&id=' + self.gamelist.games[i].id + '" id="' + self.gamelist.games[i].id + '"><td>' + self.gamelist.games[i].id + '</td><td>' + self.gamelist.games[i].status + '</td><td>' + (self.gamelist.games[i].enemyName == undefined ? "" : self.gamelist.games[i].enemyName) + '</td><td>' + ((self.gamelist.games[i].yourTurn) ? "You" : self.gamelist.games[i].enemyName) + '</td></tr>');
        }

    }
}