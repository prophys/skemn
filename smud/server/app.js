var rfr = require('rfr'),
	io = require('socket.io')(80),
	GamePlay = rfr('GameWorld/GamePlay.js'),
	User = rfr('User.js');

io.on('connection', OnClientConnect);
function OnClientConnect(client) {
	var client = new User(client);
}

var gamePlay = new GamePlay();
gamePlay.Initialize();