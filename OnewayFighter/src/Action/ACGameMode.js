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
				teamId: 'red',
				position: {
					x: 10,
					y: 0
				},
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