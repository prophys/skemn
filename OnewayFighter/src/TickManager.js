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