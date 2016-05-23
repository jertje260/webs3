function Field(x,y) {
    var self = this;
    self.x = x;
    self.y = y;
    self.clicked = false;
    self.click = function () {
        self.clicked = true;
    }
    self.hasShip = false;    
}