/*
* Time
*/
function Time() {
	Time.fixedDelta = 1/GameConfig.fps;
}

Time.Now = Date.now;