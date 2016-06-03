function Profile() {
	var self = this;
	self.id = null;
	self.naam = null;
	self.loadProfile = function (show) {
		$.ajax({
			url: url + "/users/me/info" + token,
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
			self.loadProfile(show);
		}	
	}
}