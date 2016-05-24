function MySocket() {
    var self = this;
    self.socket = io.connect(url, token);

    self.socket.on('update', function (update) {
        console.log(update);
    });
    self.socket.on('shot', function (shot) {
        console.log(shot);
    });
    self.socket.on('turn', function (turn) {
        console.log(turn);
    });
    
}