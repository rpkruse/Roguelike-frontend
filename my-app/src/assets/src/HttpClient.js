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

    xhr.open('GET', url);
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

    xhr.open("POST", url);
    xhr.setRequestHeader("accept", "application/json");

    xhr.send(data);
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