"use strict";

module.exports = exports = Weapon;

// I'm sure there's a better way to do this,
// especially wince we have to restrict weapon types to different classes.
function Weapon(aName, aLevel) {
    this.type = "Weapon";
    this.name = aName;
    this.level = aLevel;
    this.shouldRetain = true;
    this.spriteIdx = 0;
    this.spritePositions = [
        { x: 75, y: 75 },  // 0 - Magic Staff
        { x: 225, y: 75 }, // 1 - Bow
        { x: 300, y: 75 }, // 2 - Mace
        { x: 375, y: 75 }, // 3 - Knife/Sword
        { x: 450, y: 75 }, // 4 - Axe
        { x: 675, y: 75 }  // 5 - Another Magic Staff
    ];

    this.data = window.data.weapons.find(function(x) { return x.name == aName });
    
    if(!this.data) {
        console.log(aName);
    }

    this.attackType = this.data.attack_type;
    this.damageMax = this.data.max_damage;
    this.damageMin = this.data.min_damage;
    this.damageType = this.data.damage_type;
    this.range = this.data.range;
    this.hitBonus = this.data.hit_bonus;
    this.attackEffect = this.data.attack_effect;
    this.properties = this.data.properties;
    this.propertiesShort = this.data.properties_short;
    this.spriteIdx = this.data.sprite_id;

    // static properties for entities
    this.position = { x: -1, y: -1 };
    this.size = { width: 96, height: 96 };
    this.spritesheet = new Image();
    this.spritesheet.src = 'assets/spritesheets/powerup.png';
    this.resolveCollision = false;

    this.currY = 0;
    this.movingUp = true;
}

Weapon.prototype.collided = function (aEntity) {
    if (aEntity.type != "Player" && this.resolveCollision && aEntity.type != "Click") {
        this.resolveCollision = false;
        this.position = tilemap.getRandomAdjacent(this.position);
    }
}

Weapon.prototype.processTurn = function () {

}

Weapon.prototype.retain = function () {
    return this.shouldRetain;
}

Weapon.prototype.update = function () {
    if (this.currY >= 5) this.movingUp = false;
    else if (this.currY <= -5) this.movingUp = true;
    if (this.movingUp) this.currY += .2;
    else this.currY -= .2;
}

Weapon.prototype.render = function (time, ctx) {
    var position = window.tilemap.toScreenCoords(this.position);
    var spriteSource = this.spritePositions[this.spriteIdx];
    ctx.drawImage(this.spritesheet, spriteSource.x, spriteSource.y, 75, 75, (position.x * this.size.width), (position.y * this.size.height) + this.currY, 96, 96);
}

Weapon.prototype.toString = function () {
    return `Level ${this.level} ${this.name} with damage range ${this.damageMin + parseInt(this.level)}-${this.damageMax + parseInt(this.level)}, with ${this.properties}`
}
