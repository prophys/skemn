/*
* Util
*/
function Util() {
}

Util.Log = function() {
	console.log.apply(console, arguments);
}

module.exports = Util;