function MySocket(app) {
    var self = this;
    var options = { query: token };
    self.socket = io.connect(url, options);
    console.log(self.socket);
    self.socket.on('update', function (update) {
        if (app.ctrl.gameUpdate != undefined && typeof app.ctrl.gameUpdate === "function") {
            app.ctrl.gameUpdate(update);
        }
        console.log(update);
    });
    self.socket.on('shot', function (shot) {
        console.log(shot);
        if (app.ctrl.shotUpdate != undefined && typeof app.ctrl.shotUpdate === "function") {
            app.ctrl.shotUpdate(shot);
        }
    });
    self.socket.on('turn', function (turn) {
        console.log(turn);
        if (app.ctrl.turnUpdate != undefined && typeof app.ctrl.turnUpdate === "function") {
            app.ctrl.turnUpdate(turn);
        }

    });

}