var Mode = require('./Mode');

function FFA() {
    Mode.apply(this, Array.prototype.slice.call(arguments));

    this.ID = 0;
    this.name = "Free For All";
    this.specByLeaderboard = true;
	this.count = 5;
	this.winner = "";
	this.isWon = false;
	
}

module.exports = FFA;
FFA.prototype = new Mode();

// Gamemode Specific Functions

FFA.prototype.onPlayerSpawn = function(gameServer, player) {
    player.color = gameServer.getRandomColor();
    // Spawn player
    gameServer.spawnPlayer(player, gameServer.randomPos());
};

FFA.prototype.updateLB = function(gameServer, lb) {
    gameServer.leaderboardType = this.packetLB;

    for (var i = 0, pos = 0; i < gameServer.clients.length; i++) {
        var player = gameServer.clients[i].playerTracker;
        if (player.isRemoved || !player.cells.length || 
            player.socket.isConnected == false || (!gameServer.config.minionsOnLeaderboard && player.isMi))
            continue;

        for (var j = 0; j < pos; j++)
            if (lb[j]._score < player._score) break;

        lb.splice(j, 0, player);
        pos++;
    };
	
    this.rankOne = lb[0];

	if(this.rankOne == undefined) {
		
		return;
		
	}else{
		
		if(this.isWon || this.rankOne._score >= 50000){
			
			this.isWon = true;
			if(this.count == 0){
				
				this.winner = "";
				this.count = 5;
				
				gameServer.restart();
				
			};
			
			if(this.winner == "") this.winner = this.rankOne._name;
			
			var board = [
			
				this.winner,
				"won",
				"500 coins",
				"250 XP",
				"The game will",
				"restart in",
				this.count.toString()
			
			];
			
			this.count--;
			this.specByLeaderboard = false;
			gameServer.leaderboardType = 48;
			gameServer.leaderboard = board;
			
		};
		
	};
	
};
