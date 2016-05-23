function Profile() {
	var self = this;
	self.id = null;
	self.naam = null;
	self.loadProfile = function () {
		$.ajax({
			url: url + "/users/me/info" + token,
			success: function (result) {
				$('#profileid').html(result._id);
				$('#profilename').html(result.name);
			}
		});
	}

	if (self.id == null) {
		self.loadProfile();
	}
}