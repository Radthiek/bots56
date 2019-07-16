var Cell = require('./Cell');
var Logger = require('../modules/Logger');

function VirusShooter() {
    Cell.apply(this, Array.prototype.slice.call(arguments));
    
    this.cellType = 2;
    this.isSpiked = true;
    this.color = { r: 0, g: 0xff, b: 0 };
	this.boostInterval = null;
	
}

module.exports = VirusShooter;
VirusShooter.prototype = new Cell();

// Main Functions

VirusShooter.prototype.canEat = function (cell) { // No puede absorver a ningun tipo de comida
    return false;
};

VirusShooter.prototype.onEat = function (prey) {
    // Called to eat prey cell
    
};

VirusShooter.prototype.onEaten = function (consumer, gameServer) { // Al ser comido por consumer
	
	
};

VirusShooter.prototype.onAdd = function (gameServer) {
    gameServer.nodesVirusShooter.push(this);
	
	var that = this;
	this.boostInterval = setInterval(function(){
		
		that.setBoost(200, that.angle);
		
	}, 30);
};

VirusShooter.prototype.checkBorder = function (b) {
    var r = this._size / 2;
    if (this.position.x < b.minx + r || this.position.x > b.maxx - r) {
        this.gameServer.removeNode(this);
    }
    if (this.position.y < b.miny + r || this.position.y > b.maxy - r) {
        this.gameServer.removeNode(this);
    }
};

VirusShooter.prototype.onRemove = function (gameServer) {
	if(this.boostInterval != null){
		
		clearInterval(this.boostInterval);
		
	};
	
    var index = gameServer.nodesVirusShooter.indexOf(this);
    if (index != -1) {
        gameServer.nodesVirusShooter.splice(index, 1);
    } else {
        Logger.error("VirusShooter.onRemove: Tried to remove a non existing VirusShooter!");
    }
};