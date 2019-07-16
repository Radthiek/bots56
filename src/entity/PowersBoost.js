var Cell = require('./Cell');

function PowerBoost() {
    Cell.apply(this, Array.prototype.slice.call(arguments));
    
    this.cellType = 4;
	this.skin = "http://localhost/globos/assets/img/arrow.png";
}

module.exports = PowerBoost;
PowerBoost.prototype = new Cell();

// Main Functions

PowerBoost.prototype.onAdd = function (gameServer) {
    // Add to list of ejected mass
    gameServer.nodesPowers.push(this);
};

PowerBoost.prototype.onRemove = function (gameServer) {
    // Remove from list of ejected mass
    var index = gameServer.nodesPowers.indexOf(this);
    if (index != -1) {
        gameServer.nodesPowers.splice(index, 1);
    }
};

PowerBoost.prototype.onEaten = function(cell) {
	
	if (!cell.owner) return;
	
	cell.owner.haveBooster = true;
	cell.owner.numberOfBooster++;
	cell.owner.onPowerPlant();
	
};