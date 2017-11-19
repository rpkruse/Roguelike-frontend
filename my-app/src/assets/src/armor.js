"use strict";

module.exports = exports = Armor;

function Armor(aName, aLevel) {
    this.type = "Armor";
    this.name = aName;
    this.level = aLevel;
    this.shouldRetain = true;
    
    var data = window.data.armors.find(function(x){ return x.name == aName; });
    this.defense = data.defense_value;
    this.strongType = data.strong_type;
    this.weakType = data.weak_type;

    // static properties for entities
    this.position = { x: -1, y: -1 };
    this.size = { width: 96, height: 96 };
    this.spritesheet = new Image();
    this.spritesheet.src = 'assets/spritesheets/powerup.png';
    this.resolveCollision = false;

    this.currY = 0;
    this.movingUp = true;
}

Armor.prototype.collided = function (aEntity) {
    if (this.resolveCollision && aEntity.type != "Player" && aEntity.type != "Click") {
        this.resolveCollision = false;
		this.position = window.tilemap.getRandomAdjacent(this.position);
    }
}

Armor.prototype.processTurn = function () {

}

Armor.prototype.retain = function () {
    return this.shouldRetain;
}

Armor.prototype.update = function () {
    if (this.currY >= 5) this.movingUp = false;
    else if (this.currY <= -5) this.movingUp = true;
    if (this.movingUp) this.currY += .2;
    else this.currY -= .2;
}

Armor.prototype.render = function (time, ctx) {
    var position = window.tilemap.toScreenCoords(this.position);
    ctx.drawImage(this.spritesheet, 305, 225, 75, 75, (position.x * this.size.width), (position.y * this.size.height) + this.currY, 96, 96);

}

Armor.prototype.toString = function () {
    return `Level ${this.level} ${this.name} with ${this.defense} defense`;
}
