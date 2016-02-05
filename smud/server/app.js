var rfr = require('rfr'),
	io = require('socket.io')(80),
	GamePlay = rfr('GameWorld/GamePlay.js'),
	IHLogin = rfr('GameWorld/IH/IHLogin.js');

io.on('connection', OnClientConnect);
function OnClientConnect(client) {
	var client = new IHLogin(client);
}

var gamePlay = new GamePlay();
gamePlay.Initialize();