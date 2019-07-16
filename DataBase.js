var mysql = require('mysql');
var Monologue = require("monologue.js");
var db_config = null;
var md5 = require("./md5.js");

function DataBase(id){
	
	this.user = ""; //DB USERNAME
	this.pass = ""; //DB PASS
	this.url = "";
	this.host = ""; //DB HOST
	this.db = ""; //DB NAME
	this.connection = null; //Connection
	this.maxReconnectionPerSec = 1;
	this.reconnectionValue = 0;
	this.lastReconnection = 0;
	this.isOnRec = false;
	this.willReconnect = false;
	
};

DataBase.prototype = {};

DataBase.prototype.start = function(){
	
	var sv = this;
	var db_config = {
		host: 'server.agarslayers.tk',
		user: 'agarslayers',
		password: 'uiYHFREUY78FVJG87tg',
		database: 'agarslayers',
		supportBigNumbers   : true,
        connectTimeout      : 7000,
        connectionLimit     : 1000,
        queueLimit          : 1000
	};

	sv.connection;

	function handleDisconnect() {
		if(sv.willReconnect) {
			
			return;
			
		}else{
		
			if(sv.lastReconnection < (Date.now() - 2000) && sv.reconnectionValue < sv.maxReconnectionPerSec){
				
				sv.connection = mysql.createPool(db_config);
				
				sv.connection.getConnection(function(err) {
					
					if (!err) {
						
						Logger.info('DATABASE CONNECTED !');
						sv.emit("connect");
						
					} else {
						
						Logger.error('DATABASE ERROR ON CONNECTION: ' + err + "");
						if (sv.lastReconnection < (Date.now() - 2000) && sv.reconnectionValue < sv.maxReconnectionPerSec){
							
							sv.emit("error", err);
							
							sv.reconnectionValue++;
							sv.lastReconnection = Date.now();
							
							sv.handleDisconnect();
							
							
						}else{
							
							if (sv.isOnRec == false) {
								
								sv.isOnRec = true;
								sv.willReconnect = true;
								
								setTimeout(function(){
									
									sv.willReconnect = false;
									sv.reconnectionValue = 0;
									sv.lastReconnection = 0;
									sv.handleDisconnect();
									sv.isOnRec = false;
									
								}, 2000);
								
							};
							
						};
						
					};
					
				});
				
				sv.connection.on('error', function(err) {
					Logger.error('DATABASE ERROR : ' + err + "");

					if (sv.lastReconnection < (Date.now() - 2000) && sv.reconnectionValue < sv.maxReconnectionPerSec){

							sv.reconnectionValue++;
							sv.lastReconnection = Date.now();
							
							sv.handleDisconnect();
							
						}else{
							
							if (sv.isOnRec == false) {
								
								sv.isOnRec = true;
								sv.willReconnect = true;
								
							setTimeout(function(){
								
								sv.willReconnect = false;
								sv.reconnectionValue = 0;
								sv.lastReconnection = 0;
								sv.handleDisconnect();
								sv.isOnRec = false;
								
							}, 2000);
						
						};
						
					};
					
				});
				
			};
			
		};
		
	};

	this.handleDisconnect = handleDisconnect;
	
	setInterval(function(){
		
		sv.connection.end();
		sv.connect();
		
	}, 5 * 60000);
	
};

DataBase.prototype.connect = function(){
	
	this.handleDisconnect();
	
};

DataBase.prototype.getConnectiong = function(){
	
	return this.connection;
	
};

DataBase.prototype.getConnection = function(){

	return this.connection;
	
};

DataBase.prototype.checkIfUserExist = function(username, callback){
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	
	var conn = this.getConnection();
	
	var request = "SELECT * FROM `members` WHERE username='" + username + "'";
	
	//Let check first if user exist
	conn.query(request, function(err, rows, fields) {
		
		if(err == null) {

            if(rows.length != 0) {
				
				callback(true);
				
			}else{
				
				callback(false);
				
			};
			
		}else{
			
			callback(true);
			
		};
		
	});
	
};

DataBase.prototype.setProfileImage = function(username, img){
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	img = img.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	var that = this;
	var conn = this.getConnection();
	
	this.checkIfUserExist(username, function(){
		
		var request = "UPDATE `members` SET profile_img='" + img + "' WHERE username='" + username + "'";
		
		conn.query(request, function(err, rows, fields) {
		
			if(err != null) {
				
				Logger.error(err);
				
				
				that.connect();
				
			}else{
				
				Logger.info("Successful update image profile for user " + username + " to " + img);
				
			};
				
		});
		
	});
	
};

DataBase.prototype.getNextLvLXP = function(lvl, xp){
	
	return Math.floor(Math.sqrt(Math.pow(lvl, 8.2)) + (lvl * 150) - 1);
	
};

DataBase.prototype.updateLeaderBoardJSON = function(username, json, packet){
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	var conn = this.getConnection();
	var json_string = JSON.stringify(json);
	
	this.checkIfUserExist(username, function(){
			
			var request = "UPDATE `members` SET leaderboardJSON='" + json_string + "' WHERE username='" + username + "'";
			
			conn.query(request, function(err, rows, fields) {
			
				if(err != null) {
					
					Logger.error(err);
					
					that.connect();
						
				}else{
					
					Logger.info("Successful update leaderboard data for user " + username + " to " + json_string);
					
				};
					
			});
			
		});
	
};

DataBase.prototype.updateShopJSON = function(username, json, packet){
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	var conn = this.getConnection();
	var json_string = JSON.stringify(json);
	
	this.checkIfUserExist(username, function(){
			
			var request = "UPDATE `members` SET json_skins='" + json_string + "' WHERE username='" + username + "'";
			
			conn.query(request, function(err, rows, fields) {
			
				if(err != null) {
					
					Logger.error(err);
					
					that.connect();
						
				}else{
					
					Logger.info("Successful update shop data for user " + username + " to " + json_string);
					
				};
					
			});
			
		});
	
};

DataBase.prototype.updateCoins = function(username, value, packet, isBuying){
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	var conn = this.getConnection();
	isBuying = isBuying || false;
	var coins = packet.coins + value;
	packet.coins = coins;
	
	this.checkIfUserExist(username, function(){
			
			var request = "UPDATE `members` SET coins='" + coins + "' WHERE username='" + username + "'";
			
			conn.query(request, function(err, rows, fields) {
			
				if(err != null) {
					
					Logger.error(err);
					
					that.connect();
						
				}else{
					
					Logger.info("Successful update coins for user " + username + " to " + coins);
					Logger.info("User lvl up!");
					
				};
					
			});
			
		});
	
};

DataBase.prototype.removeCoins = function(username, value, packet, isBuying){
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	var conn = this.getConnection();
	isBuying = isBuying || false;
	var coins = packet.coins + value;
	packet.coins = coins;
	
	this.checkIfUserExist(username, function(){
			
			var request = "UPDATE `members` SET coins='" + coins + "' WHERE username='" + username + "'";
			
			conn.query(request, function(err, rows, fields) {
			
				if(err != null) {
					
					Logger.error(err);
					
					that.connect();
						
				}else{
					
					Logger.info("Successful update coins for user " + username + " to " + coins);
					Logger.info("User lvl up!");
					
				};
					
			});
			
		});
	
};


DataBase.prototype.updateXp = function(username, value, lvl, packet){
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	var that = this;
	var conn = this.getConnection();
	
	if(packet.json.haveXPBoost == true){
		
		value *= 2;
		
	};
	
	packet.xp = xp;
	
	var lvlUpXp = this.getNextLvLXP(lvl, value);
	var coins = packet.coins;
	
	if(value >= lvlUpXp){
	
		//LvL up record
		lvl++;
		packet.lvl++;
		
		if(lvl % 10 === 0){
			
			coins += 100 * lvl;
			
		};
		
		packet.coins = coins;
		
		this.checkIfUserExist(username, function(){
			
			var request = "UPDATE `members` SET xp='" + value + "', lvl='"+lvl+"', coins='"+coins+"' WHERE username='" + username + "'";
			
			conn.query(request, function(err, rows, fields) {
			
				if(err != null) {
					
					Logger.error(err);
					
					that.connect();
						
				}else{
					
					Logger.info("Successful update xp for user " + username + " to " + value);
					Logger.info("User lvl up!");
					
				};
					
			});
			
		});
	
	}else{
		
		this.checkIfUserExist(username, function(){
			
			var request = "UPDATE `members` SET xp='" + value + "' WHERE username='" + username + "'";
			
			conn.query(request, function(err, rows, fields) {
			
				if(err != null) {
					
					Logger.error(err);
					
					
					that.connect();
					
				}else{
					
					Logger.info("Successful update xp for user " + username + " to " + value);
					
				};
					
			});
			
		});
		
	};

	
};

DataBase.prototype.getUserInfo = function(username, pass, callback){
	var that = this;
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	
	if(!username) callback(true, 7);
	if(!pass) callback(true, 7);
	
	if(pass.length <= 4) {
		
		callback(true, 5);
		return;
		
	};
	
	if(username.length <= 3) {
		
		callback(true, 6);
		return;
		
	};
	
	var conn = this.getConnection();
	var newPass = md5(pass, "9uHW6H837hLS83h");
	Logger.info("Checking pass.");
		
	this.checkIfUserExist(username, function(userExist){
		
		if(userExist){
			
			var request = "SELECT * FROM `members` WHERE username='"+ username +"' and password='"+ newPass +"'";
			
			conn.query(request, function(err, rows, fields) {
		
				if(err == null) {
					
					if(rows.length != 0){
						
						Logger.warn("User logged in!");
						callback(false, rows[0]);
						
					}else{
						
						Logger.warn("Wrong pass.");
						callback(true, 2);
						
					};
					
				}else{
					
					
					that.connect();
					Logger.error(err);
					callback(true, 7);
					
				};
				
			});
			
		}else{
			
			Logger.warn("User dont exist");
			callback(true, 7);
			
		};
		
	});
	
};

DataBase.prototype.registerNewUser = function(username, pass, callback){
	var errorCode = 0;
	var that = this;
	username = username.replace("SELECT", "").replace("WHERE", "").replace("FROM", "").replace("DELETE", "").replace("LIKE", "").replace("UPDATE", "").replace("AND", "").replace("and", "").replace("<script>", "").replace("</script>", "").replace("()", "").replace("'", "").replace('"', "").replace("`", "");
	
	if(!username) return;
	if(!pass) return;
	
	if(pass.length <= 4) {
		
		errorCode = 5;
		callback(true, errorCode);
		return;
		
	};
	
	if(username.length <= 3) {
		
		errorCode = 6;
		callback(true, errorCode);
		return;
		
	};
	
	var conn = this.getConnection();
	var newPass = md5(pass, "9uHW6H837hLS83h");
	
	this.checkIfUserExist(username, function(userExist){
		
		if(!userExist){
			
			var request = "INSERT INTO `members`(`username`, `password`) VALUES ('" + username + "','" + newPass + "')";
			
			conn.query(request, function(err, rows, fields) {
		
				if(err == null) {

					callback(false);
					
				}else{
					
					that.connect();
					Logger.error(err);
					errorCode = 7;
					callback(true, errorCode);
					
				};
				
			});
			
		}else{
			
			errorCode = 4;
			callback(true, errorCode);
			
		};
		
	});
	
};

Monologue.mixInto(DataBase);

module.exports = DataBase;