var Cell = require('./Cell');

function Coin() {
    Cell.apply(this, Array.prototype.slice.call(arguments));
    
    this.cellType = 5;
	this.skin = "http://localhost/globos/assets/img/coin.png";
}

module.exports = Coin;
Coin.prototype = new Cell();

// Main Functions

Coin.prototype.onAdd = function (gameServer) {
    // Add to list of ejected mass
    gameServer.nodesCoin.push(this);
};

Coin.prototype.onRemove = function (gameServer) {
    // Remove from list of ejected mass
    var index = gameServer.nodesCoin.indexOf(this);
    if (index != -1) {
        gameServer.nodesCoin.splice(index, 1);
    }
};
