/*
* GameWorld class
*/
function GameWorld() {
	this.addedGameObjects = [];
	this.gameObjects = [];
	this.temp = [];
	GameWorld.Instance = this;
}

GameWorld.prototype = {

	AddGameObject: function(gameObject) {
		this.addedGameObjects.push(gameObject);
	},

	OnTick: function() {
		var i, len;
		for(i=0, len=this.addedGameObjects.length; i<len; ++i) {
			this.gameObjects.push(this.addedGameObjects[i]);
		}
		this.addedGameObjects.length = 0;

		this.temp.length = 0;
		for(i=0, len=this.gameObjects.length; i<len; ++i) {
			this.gameObjects[i].OnTick();
			if (this.gameObjects[i].isDestroyed == false) {
				this.temp.push(this.gameObjects[i]);
			}
		}

		var temp = this.gameObjects;
		this.gameObjects = this.temp;
		this.temp = temp;
	},

	Dispose: function() {
		this.addedGameObjects = null;
		this.gameObjects = null;
		this.temp = null;
		GameWorld.Instance = null;
	}
};