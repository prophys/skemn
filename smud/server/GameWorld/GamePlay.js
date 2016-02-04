var rfr = require('rfr'),
	GameWorld = rfr('GameWorld/GameWorld.js'),
	GameObject = rfr('GameWorld/GameObject.js'),
	TickManager = rfr('GameWorld/TickManager.js');

function GamePlay() {
	this.gameWorld = null;
	this.tickManager = null;
}

GamePlay.prototype = {

	Initialize: function() {
		this.gameWorld = new GameWorld();
		this.tickManager = new TickManager(this.gameWorld);

		// 게임 틱 매니저를 업데이트 한다.
		this.tickManager.Start();
	},

	Dispose: function() {
		this.gameWorld = null;
		this.tickManager = null;
	}
};

module.exports = GamePlay;