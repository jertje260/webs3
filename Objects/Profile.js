function Profile(ctrl) {
	var self = this;
	self.id = null;
	self.naam = null;
	self.loadProfile = function (show) {
		$.ajax({
			url: ctrl.app.config.url + "/users/me/info" + ctrl.app.config.token,
			success: function (result) {
				self.id = result._id;
				self.naam = result.name;
				if (show) {
					self.draw();
				}
				
			}
		});
	}

	self.draw = function () {
		if (self.id != null) {
			console.log("drawing profile");
			$('#profileid').html(self.id);
			$('#profilename').html(self.naam);
		} else {
			console.log("loading profile");
			self.loadProfile(true);
		}	
	}
}