"use strict";

const Tilemap = require('./tilemap');
const RNG = require("./rng");

const SPRITE_SIZE = 75;
const TILE_SIZE = 96;

/**
 * @module exports the Powerup class
 */
module.exports = exports = Powerup;

/**
 * @constructor Powerup
 * Creates a new Powerup object
 * @param {postition} position object specifying an x and y
 */
function Powerup(position, data) {
    this.size = { width: TILE_SIZE, height: TILE_SIZE };
    this.spritesheet = new Image();
    this.spritesheet.src = 'assets/spritesheets/powerup.png';
    this.type = "Powerup";
    this.animation = true;
    this.currY = 0;
    this.movingUp = true;
    this.used = false;
    this.resolveCollision = false;
    
    this.position = { x: position.x, y: position.y };
    this.data = JSON.parse(JSON.stringify(data)); 
}

/**
 * @function updates the Powerup object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Powerup.prototype.update = function(time) {
    if (this.currY >= 5) this.movingUp = false;
    else if (this.currY <= -5) this.movingUp = true;
    if (this.movingUp) this.currY += .2;
    else this.currY -= .2;
}

Powerup.prototype.processTurn = function(input) {

}

Powerup.prototype.collided = function (entity) {
    if (this.used) return;
    if (entity.type == "Player") {
        this.used = true;

        window.sfx.play(this.data.name + "Pickup");
        window.terminal.log(this.data.flavor_text, window.colors.pickup);
        entity.score++;

        client.postPickedUpPowerup(entity.db.characterID, this.data.id, function(){});

        switch (this.data.id) {
            case 1:
                entity.combat.damageBonus += 2;
                if (window.debug) console.log(entity.combat.damageBonus);
                break;
            case 2:
                var potionValue = window.combatController.healthPotion(entity.level);
                entity.combat.health += potionValue;
                if (window.debug) console.log("+" + potionValue + " health = " + entity.combat.health);
                break;
            case 3:
                entity.combat.defenseBonus += 2;
                if (window.debug) console.log(entity.combat.defenseBonus);
                break;
            case 4:
                entity.combat.attackBonus += 2;
                if (window.debug) console.log(entity.combat.attackBonus);
                break;
        }
    }
    else if (this.resolveCollision && entity.type != "Enemy" && entity.type != "Click") {
        this.resolveCollision = false;
        this.position = window.tilemap.getRandomAdjacent(this.position);
    }
}

Powerup.prototype.retain = function() {
    return !this.used;
}

/**
 * @function renders the Powerup into the provided context
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Powerup.prototype.render = function(elapsedTime, ctx) {
    var position = window.tilemap.toScreenCoords(this.position);
    ctx.drawImage(this.spritesheet, (this.data.id - 1) * 75, 150, SPRITE_SIZE, SPRITE_SIZE, (position.x * this.size.width), (position.y * this.size.height) + this.currY, TILE_SIZE, TILE_SIZE);
}
