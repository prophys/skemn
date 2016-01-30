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