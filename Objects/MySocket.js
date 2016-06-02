function MySocket() {
    var self = this;
    var options = { query: token };
    self.socket = io.connect(url, options);

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