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