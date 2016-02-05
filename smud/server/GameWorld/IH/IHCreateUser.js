var rfr = require('rfr'),
	GameWorld = rfr('GameWorld/GameWorld.js');

function User(client) {
	// intialize variables
	this.client = client;
	this.step = 'requireName';
	this.userData = {};

	// bind listener
	this.OnCmdListener = this.OnCmd.bind(this);
	client.on('cmd', this.OnCmdListener);

	// reqeust new user name
	this.Send('사용할 이름을 입력해 주세요.');
}

User.prototype = {

	Send: function(str) {
		this.client.emit('rst', str);
	},

	OnCmd: function(cmd) {
		if (this.step == 'requireName') {
			this.userData.name = cmd;
			this.step = 'requirePassword';
			this.Send('비밀번호를 입력해 주세요.');
		}
		else if (this.step == 'requirePassword') {
			this.userData.password = cmd;
			this.step = 'confirmPassword';
			this.Send('비밀번호를 확인하기 위해 다시 입력해 주세요.');
		}
		else if (this.step == 'confirmPassword') {
			if (this.userData.password != cmd) {
				this.Send('비밀번호가 맞지 않습니다. 다시 입력해 주세요.');
			}
			else {
				// Enter GameWorld
				this.Send('모험의 세계로 입장합니다.');
			}
		}
	},

	Dispose: function() {
		this.client.removeListener('cmd', this.OnCmdListener);
		this.client = null;
	}
}

module.exports = User;