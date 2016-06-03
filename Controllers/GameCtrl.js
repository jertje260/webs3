function GameCtrl(app, id) {
    var self = this;
    self.game;

    self.load = function () {
        app.load
        $.get('gamelist.html', function (html) {
            $('#view').empty().append(html);
            self.game = new Game(id);
            self.game.loadMoreInfo(id);
            self.bindEvents();
        });
    }
    
    self.bindEvents = function(){
        
    }
}