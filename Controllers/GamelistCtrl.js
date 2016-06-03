function GamelistCtrl(app) {
    var self = this;
    self.gamelist

    self.load = function () {
        $.get('gamelist.html', function(html){
           $('#view').empty().append(html);
           self.gamelist = new GameList();
           self.bindEvents();
        });
    }


    self.bindEvents = function () {
        $('#allGames').on('click', 'tr', function (event) {
            href = $(this).attr("href");
            id = href.split('id=')[1];
            app.ctrl = new GameCtrl(app, id);

            // HISTORY.PUSHSTATE
            history.pushState('', 'New URL: ' + href, href);
            event.preventDefault();
        });

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

}