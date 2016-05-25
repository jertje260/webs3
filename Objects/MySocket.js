function MySocket() {
    var self = this;
    self.socket = io();
    self.socket.connect(url, token);
    console.log(self.socket);

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