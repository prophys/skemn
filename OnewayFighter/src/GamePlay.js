/*
* GamePlay
*/
function GamePlay() {
	this.gameWorld = null;
	this.tickManager = null;
}

GamePlay.prototype = {

	Initialize: function() {
		this.gameWorld = new GameWorld();
		this.tickManager = new TickManager(this.gameWorld);

		var gameMode = new GameObject({
			id: 'gameMode',
			name: 'gameMode'
		});
		gameMode.AddAction(new ACGameMode());

		// 게임 틱 매니저를 업데이트 한다.
		this.tickManager.Start();
	},

	Dispose: function() {
		this.gameWorld = null;
		this.tickManager = null;
	}
};