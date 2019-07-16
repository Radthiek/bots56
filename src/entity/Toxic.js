var Cell = require('./Cell');

function Toxic() {
    Cell.apply(this, Array.prototype.slice.call(arguments));
    
    this.cellType = 6;
	this.skin = "http://localhost/globos/assets/img/arrow.png";
}

module.exports = Toxic;
Toxic.prototype = new Cell();

// Main Functions

Toxic.prototype.onAdd = function (gameServer) {
    // Add to list of ejected mass
    gameServer.nodesToxic.push(this);
};

Toxic.prototype.onRemove = function (gameServer) {
    // Remove from list of ejected mass
    var index = gameServer.nodesToxic.indexOf(this);
    if (index != -1) {
        gameServer.nodesToxic.splice(index, 1);
    }
};

Toxic.prototype.onEaten = function(cell) {
	
	if (!cell.owner) return;
	
	cell.owner.toxicNumber++;
	
};