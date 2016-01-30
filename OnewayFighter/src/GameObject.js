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