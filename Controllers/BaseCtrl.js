function BaseCtrl(app){
    var self = this;
    self.profile;
    
    self.load = function(){
        self.draw();
    }
    self.draw = function () {
        if (location.search == "?page=profile") {
            self.profile = new Profile();

            app.loadPage(app.pagelist["/webs3/" + location.search], function(){
                self.profile.draw();
            });
        } else {
            app.loadPage(app.pagelist["/webs3/" + location.search]);
        }      
    }
    
}

