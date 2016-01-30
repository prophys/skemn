(function() {
/*
* GameConfig
*/
function GameConfig() {
};
GameConfig.fps = 32;

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

	// 전투 관련 속성 값
	this.temaId = args.teamId || '';
	this.maxHp = args.maxHp || 100;
	this.hp = this.maxHp;
	this.attackRange = args.attackRange || 1;
	this.attackPower = args.attackPower || 1;
	this.attackCooltime = args.attackCooltime || 3;

	// 이동 관련 속성 값
	this.speed = args.speed || 1;

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

	Attack: function(target) {
		Util.Log(this.name, ' attack ', target.name, ' with attack power ', this.attackPower);
		target.OnDamage(this);
	},

	OnDamage: function(attacker) {
		var damage = attacker.attackPower;
		var hp = this.hp;
		this.hp = Math.max(0, this.hp - damage);
		var delta = hp - this.hp;
		Util.Log(this.name, ' damaged from ', attacker.name, ' amount ', delta);

		if (this.hp <= 0) {
			Util.Log(this.name, ' dead.');
			this.Dispose();
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
			if (this.gameObjects[i].isDestroyed == false) {
				this.gameObjects[i].OnTick();
				this.temp.push(this.gameObjects[i]);
			}
		}

		var temp = this.gameObjects;
		this.gameObjects = this.temp;
		this.temp = temp;
	},

	GetGameObjectInRange: function(args) {
		var result = [];
		if (args == null) {
			return result;
		}
		var from = args.from;
		var range = args.range;
		var tag = args.tag || null;
		for(var i=0, len=this.gameObjects.length; i<len; ++i) {
			if (tag != null && this.gameObjects[i].tags[tag] == false) {
				continue;
			}
			if (Math.abs(from.x - this.gameObjects[i].position.x) <= range) {
				result.push(this.gameObjects[i]);
			}
		}
		return result;
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
		Time.time = currentTime / 1000;
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
}

Time.Now = Date.now;
Time.time = Time.Now() / 1000;
Time.fixedDelta = 1/GameConfig.fps;

/*
* Util
*/
function Util() {
}

Util.Log = function() {
	console.log.apply(console, arguments);
}

/*
* ACGameMode class
*/
function ACGameMode() {
}

ACGameMode.prototype = {

	Begin: function() {
		this.elapsedTime = 0;
		this.mobIdx = 0;

		var player = new GameObject({
			id: 'player',
			name: 'player',
			speed: 1,
			teamId: 'blue',
			tags: {
				unit: true
			}
		});
		player.AddAction(new ACWalkFight({
			isMoveToRight: true
		}));

		this.player = player;
	},

	OnTick: function() {
		this.elapsedTime += Time.fixedDelta;
		if (this.elapsedTime > 3) {
			this.elapsedTime = 0;
			Util.Log('create new mob');
			var mob = new GameObject({
				id: 'Mob_' + (++this.mobIdx),
				name: 'Mob',
				tags: {
					unit: true
				}
			});

			mob.AddAction(new ACWalkFight({
				isMoveToRight: false
			}));
		}
	},

	Dispose: function() {
		this.player = null;
	}
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
/*
* ACWalkFight action class
*/
function ACWalkFight(args) { 
	args = args || {};
	this.isMoveToRight = args.isMoveToRight || false;
	this.prevAttackTime = 0;
}

ACWalkFight.prototype = {

	Begin: function() {
	},

	OnTick: function() {
		if (this.gameObject.hp <= 0) {
			Util.Log(this.gameObject.id, ' die.');
			this.Dispose();
			return;
		}

		var targets = GameWorld.Instance.GetGameObjectInRange({
			from: this.gameObject.position,
			range: this.gameObject.attackRange,
			tag: 'unit'
		});
		var target = null;
		for (var i=0, len=targets.length; i<len; ++i) {
			if (targets[i].teamId != this.gameObject.teamId) {
				target = targets[i];
				break;
			}
		}

		if (target != null) {
			if (Time.time - this.prevAttackTime >= this.gameObject.attackCooltime) {
				this.gameObject.Attack(target);
				this.prevAttackTime = Time.time;
			}
		}
		else {
			var moveAmount = (this.gameObject.speed * Time.fixedDelta);
			this.gameObject.position.x += (this.isMoveToRight ? moveAmount : -moveAmount); 
		}
	},

	Dispose: function() {
		this.gameObject = null;
		this.isFinished = true;
	}
};
Main();
}())