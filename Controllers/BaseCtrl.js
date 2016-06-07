function BaseCtrl(app){
    var self = this;
    self.profile;
    self.app = app;
    
    self.load = function(){
        self.draw();
    }
    self.draw = function () {
        if (location.search == "?page=profile") {
            self.profile = new Profile(self);
            $('#profile').addClass('active');
            app.loadPage(app.pagelist["/webs3/" + location.search], function(){
                self.profile.draw();
            });
        } else {
            if (location.search == "") {
                $('#home').addClass('active');
            } else {
                $('#todo').addClass('active');
            }
            app.loadPage(app.pagelist["/webs3/" + location.search]);
        }      
    }
    
}

