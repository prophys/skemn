(function() {

	/*
	* GameConfig
	*/
	var GameConfig = {
		fps: 30
	};

	/*
	* Util
	*/
	var Util = {
		Log: function() {
			console.log.apply(console, arguments);
		}
	};

	/*
	* Time
	*/
	var Time = {
		Now: Date.now,
		delta: 0
	};

	/*
	* GameObject class
	*/
	function GameObject() {
		this.id = null;
		this.name = null;
		this.position = { x:0, y:0 };
		this.tags = {};
		this.actions = [];
	}

	GameObject.prototype = {

		AddAction: function(action) {
			if (action.gameObject == this) {
				return;
			}
			this.actions.push(action);
		},

		OnTick: function() {
		},

		Dispose: function() {
		}
	};

	/*
	* GameWorld class
	*/
	function GameWorld() { }

	GameWorld.prototype = {

		AddGameObject: function(gameObject) {
		},

		RemoveGameObject: function(gameObject) {
		},

		OnTick: function() {
		}
	};

	/*
	* TickManager class
	*/
	function TickManager(gameWorld) {
		this.gameWorld = gameWorld;
		this.prevTime = Time.Now();
		this.elapsedTime = 0;
		this.secondPerTick = 1000 / GameConfig.fps;
	}

	TickManager.prototype = {

		Update: function() {
			var currentTime = Time.Now();
			Time.delta = currentTime - this.prevTime;
			this.elapsedTime += Time.delta;
			while (this.elapsedTime > this.secondPerTick) {
				this.elapsedTime -= this.secondPerTick;
				this.gameWorld.OnTick();
			}
			this.prevTime = currentTime;
		}
	}

	/*
	* Main
	*/
	var gameWorld = new GameWorld();
	var tickManager = new TickManager(gameWorld);

	setInterval(tickManager.Update.bind(tickManager));

	var player = new GameObject();
	player.id = 'player';
}())