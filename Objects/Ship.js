function Ship(id, name, length, orientation){
    var self = this;
    
    self.isHorizontal = orientation;
    self.name = name;
    self.length = length;
    self.x = null;
    self.y = null;
    self.id =id;
    
    self.flip = function(){
        self.isHorizontal = !self.isHorizontal;
    }
}