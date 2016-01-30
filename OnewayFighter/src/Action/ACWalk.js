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