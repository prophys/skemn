var rfr = require('rfr');

function User(client) {
	this.client = client;
	client.emit('connected');
	client.on('userinfo', this.OnUserInfo.bind(this));
	client.on('cmd', this.OnCmd.bind(this));
}

User.prototype = {

	OnUserInfo: function(data) {
		console.log(data);
	},

	OnCmd: function(data) {
		console.log(data);
	}
}

module.exports = User;