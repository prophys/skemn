(function() {
/*
* GameConfig
*/
function GameConfig() {
	GameConfig.fps = 32;
};
/*
* GameObject class
*/
function GameObject(args) {
	// 기본 변수값을 세팅한다.
	args = args || {};
	this.id = args.id;
	this.name = args.name;
	this.position = args.position || { x:0, y:0 };
	this.tags = args.tags || {};
	this.isDestroyed = false;
	this.actions = [];

	// 추가 값을 세팅한다.
	for (var key in args) {
		this[key] = args[key];
	}

	// 게임월드에 추가한다.
	GameWorld.Instance.AddGameObject(this);
}

GameObject.prototype = {

	AddAction: function(action) {
		if (action.gameObject == this) {
			Util.Log('[GameObject] Already added action. ', action.name);
			return;
		}
		this.actions.push(action);
		action.gameObject = this;
		action.Begin();
	},

	IsIdle: function() {
		return this.actions.length == 0;
	},

	OnTick: function() {
		if (this.actions.length == 0) {
			return;
		}
		var headAction = this.actions[0];
		if (headAction.isFinished) {
			this.actions.pop();
		}
		else {
			headAction.OnTick();
		}
	},

	Dispose: function() {
		this.isDestroyed = true;
		this.actions = null;
	}
};
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

		var player = new GameObject({
			id: 'player',
			name: 'player',
			speed: 1
		});

		player.AddAction(new ACWalk());

		// 게임 틱 매니저를 업데이트 한다.
		this.tickManager.Start();
	},

	Dispose: function() {
		this.gameWorld = null;
		this.tickManager = null;
	}
};
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
/*
* Main
*/
function Main() {
	var gamePlay = new GamePlay();
	gamePlay.Initialize();
}
/*
* TickManager class
*/
function TickManager(gameWorld) {
	this.gameWorld = gameWorld;
	this.prevTime = Time.Now();
	this.elapsedTime = 0;
	this.setIntervalKey = null;
}

TickManager.prototype = {

	Update: function() {
		var currentTime = Time.Now();
		var delta = (currentTime - this.prevTime) / 1000;
		this.elapsedTime += delta;
		while (this.elapsedTime > Time.fixedDelta) {
			this.elapsedTime -= Time.fixedDelta;
			this.gameWorld.OnTick();
		}
		this.prevTime = currentTime;
	},

	Start: function() {
		this.setIntervalKey = setInterval(this.Update.bind(this));
	},

	Dispose: function() {
		this.gameWorld = null;
	}
}
/*
* Time
*/
function Time() {
	Time.fixedDelta = 1/GameConfig.fps;
}

Time.Now = Date.now;
/*
* Util
*/
function Util() {
}

Util.Log = function() {
	console.log.apply(console, arguments);
}

/*
* ACWalk action class
*/
function ACWalk(args) { 
	args = args || {};
	this.targetPosition = args.targetPosition;
}

ACWalk.prototype = {

	Begin: function() {
		this.targetPosition = this.targetPosition || this.gameObject.position;
	},

	OnTick: function() {
		this.gameObject.position.x += (this.gameObject.speed * Time.fixedDelta);
	},

	Dispose: function() {
		this.gameObject = null;
		this.isFinished = true;
	}
};
Main();
}())