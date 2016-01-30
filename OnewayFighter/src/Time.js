/*
* Time
*/
function Time() {
}

Time.Now = Date.now;
Time.time = Time.Now() / 1000;
Time.fixedDelta = 1/GameConfig.fps;
