"use strict";

module.exports = exports = HttpClient;

function HttpClient() {
    this.baseURL = "https://rogueapi.keisenb.io/api";
}

HttpClient.prototype.get = function(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
            callback(this.status, JSON.parse(this.responseText));
        }
    });
    var token = sessionStorage.getItem("token");

    xhr.open('GET', url);
    xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(token));

    xhr.send(null);
}

HttpClient.prototype.post = function(url, params, callback) {
    var data = new FormData();

    Object.entries(params).forEach(function([key, value]) {
        data.append(key, value);
    });

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            callback(this.status, JSON.parse(this.responseText));
        }
    });

    var token = sessionStorage.getItem("token");

    xhr.open("POST", url);
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(token));

    xhr.send(data);
}

HttpClient.prototype.put = function(url, params, callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            callback(this.status, JSON.parse(this.responseText));
        }
    });

    var token = sessionStorage.getItem("token");

    xhr.open("PUT", url);
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(token));

    xhr.send(JSON.stringify(params));
}

HttpClient.prototype.log = function(msg) {
    if (window.debug) console.log(msg);
}

HttpClient.prototype.listPowerups = function(callback) {
    this.get(this.baseURL + "/powerups", function(status, json){
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error getting powerups. Code: " + status); 
        callback([]);
    });
}

HttpClient.prototype.listPowerup = function(id, callback) { 
    this.get(this.baseURL + "/powerups/" + id, function(status, json){
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error getting powerup. Code: " + status); 
        callback([]);
    });
}

HttpClient.prototype.listArmors = function(callback) {
    this.get(this.baseURL + "/armors", function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error getting armors. Code: " + status);
        callback([]);
    });
}

HttpClient.prototype.listClasses = function(callback) {
    this.get(this.baseURL + "/classes", function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error getting classes. Code: " + status);
        callback([]);
    });
}

HttpClient.prototype.listWeapons = function(callback) {
    this.get(this.baseURL + "/weapons", function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error getting weapons. Code: " + status);
        callback([]);
    });
}

HttpClient.prototype.createCharacterHistory = function(characterID, score, levelID, callback) {
    var params = {
        character_id: characterID,
        score: score,
        level_id: levelID
    };

    this.post(this.baseURL + "/characters/history", params, function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error creating CharacterHistory: " + status);
        callback([]);
    });
}

HttpClient.prototype.updateCharacterHistory = function(characterHistoryID, params, callback) {
    this.put(this.baseURL + "/characters/history/" + characterHistoryID, params, function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error updating character history: " + status);
        callback([]);
    });
}

HttpClient.prototype.postPickedUpPowerup = function(characterID, powerupID, callback) {
    var params = {
        character_id: characterID,
        power_up_id: powerupID
    }

    this.post(this.baseURL + "/powerups", params, function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error posting picked up powerup: " + status);
        callback([]);
    });
}

HttpClient.prototype.createLevel = function(levelNumber, seed, callback) {
    var params = {
        number: levelNumber,
        seed: seed
    };

    this.post(this.baseURL + "/levels", params, function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error creating level: " + status);
        callback([]);
    });
}

HttpClient.prototype.createCharacter = function(name, health, attackBonus, damageBonus, defenseBonus, weaponID, armorID, classID, callback) {
    var params = {
        name: name,
        health: health,
        attack_bonus: attackBonus,
        damage_bonus: damageBonus,
        defense_bonus: defenseBonus,
        weapon_id: weaponID,
        armor_id: armorID,
        class_id: classID
    };

    this.post(this.baseURL + "/characters", params, function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error creating character: " + status);
        callback([]);
    });
}

HttpClient.prototype.updateCharacter = function(characterID, params, callback) {
    this.put(this.baseURL + "/characters/" + characterID, params, function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error updating character: " + status);
        callback([]);
    });
}

HttpClient.prototype.updateMessages = function(callback) {
    this.get(this.baseURL + "/messages", function(status, json){
        if(status == 200) {
            callback(json);
            return;
        }
        this.log("Error getting messages. Code: " + status); 
        callback([]);
    });
}

HttpClient.prototype.sendMessage = function(message, recipient, callback) {
    var params = {
        content: message,
        display_name: recipient
    };

    this.post(this.baseURL + "/messages", params, function(status, json) {
        if(status == 200) {
            callback(json);
            return;
        }
        //this.log("Error sending message: " + status);
        callback(null);
    });
}