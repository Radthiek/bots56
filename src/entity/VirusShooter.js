var Cell = require('./Cell');
var Logger = require('../modules/Logger');

function VirusShooter() {
    Cell.apply(this, Array.prototype.slice.call(arguments));
    
    this.cellType = 7;
    this.isSpiked = true;
    this.color = { r: 0, g: 0xff, b: 0 };
	this.boostInterval = null;
	this.isRemoved = false;
}

module.exports = VirusShooter;
VirusShooter.prototype = new Cell();

// Main Functions

VirusShooter.prototype.canEat = function (cell) {
    return false;
};

VirusShooter.prototype.onEat = function (prey) {
    // Called to eat prey cell
    
};

VirusShooter.prototype.explodeCell = function(cell, splits) {
    for (var i = 0; i < splits.length; i++)
        this.gameServer.splitPlayerCell(cell.owner, cell, 2 * Math.PI * Math.random(), splits[i]);
};

VirusShooter.prototype.onEaten = function (cell) {
	if (!cell.owner) return;
    var config = this.gameServer.config;

    var cellsLeft = (config.virusMaxCells || config.playerMaxCells) - cell.owner.cells.length;
    if (cellsLeft <= 0) return;
    var splitMin = config.virusMaxPoppedSize * config.virusMaxPoppedSize / 100;
    var cellMass = cell._mass, splits = [], splitCount, splitMass;

    if (config.virusEqualPopSize) {
        // definite monotone splits
        splitCount = Math.min(~~(cellMass / splitMin), cellsLeft);
        splitMass = cellMass / (1 + splitCount);
        for (var i = 0; i < splitCount; i++)
            splits.push(splitMass);
        return this.explodeCell(cell, splits);
    }

    if (cellMass / cellsLeft < splitMin) {
        // powers of 2 monotone splits
        splitCount = 2;
        splitMass = cellMass / splitCount;
        while (splitMass > splitMin && splitCount * 2 < cellsLeft)
            splitMass = cellMass / (splitCount *= 2);
        splitMass = cellMass / (splitCount + 1);
        while (splitCount-- > 0) splits.push(splitMass);
        return this.explodeCell(cell, splits);
    }

    // half-half splits
    var splitMass = cellMass / 2;
    var massLeft = cellMass / 2;
    while (cellsLeft-- > 0) {
        if (massLeft / cellsLeft < splitMin) {
            splitMass = massLeft / cellsLeft;
            while (cellsLeft-- > 0) splits.push(splitMass);
        }
        while (splitMass >= massLeft && cellsLeft > 0)
            splitMass /= 2;
        splits.push(splitMass);
        massLeft -= splitMass;
    }
    this.explodeCell(cell, splits);
	
};

VirusShooter.prototype.onAdd = function (gameServer) {
    this.gameServer.nodesVirusShooter.push(this);
};

VirusShooter.prototype.onRemove = function (gameServer) {
	if(this.boostInterval != null){
		
		clearInterval(this.boostInterval);
		
	};
	
    var index = this.gameServer.nodesVirusShooter.indexOf(this);
    if (index != -1) {
        this.gameServer.nodesVirusShooter.splice(index, 1);
    } else {
        Logger.error("VirusShooter.onRemove: Tried to remove a non existing VirusShooter!");
    }
};