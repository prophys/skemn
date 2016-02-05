var rfr = require('rfr'),
	GameWorld = rfr('GameWorld/GameWorld.js'),
	IHCreateUser = rfr('GameWorld/IH/IHCreateUser.js');

function User(client) {
	// intialize variables
	this.client = client;
	this.step = 'login';

	// bind listener
	this.OnCmdListener = this.OnCmd.bind(this);
	client.on('cmd', this.OnCmdListener);

	// send Intro
	// send login request
	this.Send('당신의 이름을 입력해 주세요. 만약 처음이라면 [#orange]새로운 유저[#] 라고 입력해주세요.');
}

User.prototype = {

	Send: function(str) {
		this.client.emit('rst', str);
	},

	OnCmd: function(cmd) {
		console.log(cmd);
		if (cmd == '새로운 유저') {
			var createUser = new IHCreateUser(this.client);
			this.Dispose();
		}
		else if (this.step == 'login') {
		}
		else if (this.step == 'password') {
		}
	},

	Dispose: function() {
		this.client.removeListener('cmd', this.OnCmdListener);
		this.client = null;
	}
}

module.exports = User;