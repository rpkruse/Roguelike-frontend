"use strict";

const Tilemap = require('./tilemap');
const CombatClass = require("./combat_class");
const Animator = require("./animator.js");
module.exports = exports = Enemy;

function Enemy(position, combatClass, target, onDeathCB) {
    this.state = "idle";
    this.position = { x: position.x, y: position.y };
    this.size = { width: 96, height: 96 };
    this.spritesheet = new Image();
    this.spritesheet.src = "assets/spritesheets/enemy_animations.png";
    this.type = "Enemy";
    this.class = combatClass;
    this.combat = new CombatClass(this.class, target.level);
    this.target = target;
    this.onDeathCB = onDeathCB;
    this.oldX = this.position.x;
    this.oldY = this.position.y;
    this.resolveCollision = false;

    if (this.class == "Shaman") {
        this.animator = new Animator(0, "idle", "Shaman");
    } else if (this.class == "Zombie") {
        this.animator = new Animator(3, "idle", "Zombie");
    } else if (this.class == "Skeleton") {
        this.animator = new Animator(9, "idle", "Skeleton");
    } else if (this.class == "Minotaur") {
        this.animator = new Animator(6, "idle", "Minotaur");
    } else if (this.class == "Fucking Dragon") {
        this.animator = new Animator(12, "idle", "Fucking Dragon");
    }

    var classID = data.classes.find(function(x){ return x.name == combatClass}).id;

    var self = this;
    client.createCharacter(this.class, this.combat.health, this.combat.attackBonus,
        this.combat.damageBonus, this.combat.defenseBonus, this.combat.weapon.data.id,
        this.combat.armor.data.id, classID, function(character) {
            self.characterID = character.id;
    });
}

Enemy.prototype.processTurn = function () {
    if (this.combat.status.effect != "None") window.combatController.handleStatus(this.combat);
    if (this.combat.health <= 0) {
        this.state = "dead";
        client.updateCharacter(this.characterID, { killed_by: player.db.characterID }, function(){});
    } 
    if (this.state == "dead" || this.combat.status.effect == "Frozen" || this.combat.status.effect == "Stunned") return;

    this.combat.turnAI(this);
    if(player.combat.health <= 0 && this.combat.attacked) {
        client.updateCharacter(player.db.characterID, { killed_by: this.characterID }, function(){});
    }
    this.combat.attacked = false;

    if (this.position.x < this.oldX) this.changeDirection("left");
    else if (this.position.x > this.oldX) this.changeDirection("right");
    this.oldX = this.position.x;
    this.oldY = this.position.y;
}

Enemy.prototype.update = function (time) {
    // if we're dead, we should probably do something
    if (this.combat.health <= 0) {
        this.state = "dead";
    }

    this.animator.update(time);
}

Enemy.prototype.collided = function (entity) {

}

Enemy.prototype.retain = function () {
    if (this.combat.health <= 0) {
        if (this.class == "Fucking Dragon") {
            // add stairs
            stairs = new Stairs({ x: 5, y: 2 }, function () { nextLevel(true) });
        } else {
            this.onDeathCB(this.position, window.tilemap);
        }
        return false;
    } else {
        return true;
    }
}

Enemy.prototype.playAttack = function (clickPos) {
    if (this.state != "dead" && this.target.state != "dead") {
        var position = window.tilemap.toScreenCoords(this.position);
        var playerPos = window.tilemap.toScreenCoords(this.target.position);

        if (playerPos.x < position.x) this.changeDirection("left");
        else if (playerPos.x > position.x) this.changeDirection("right");

        this.animator.updateState("attacking");
    }
}

Enemy.prototype.changeDirection = function (direction) {
    if (this.state != "dead") {
        this.animator.changeDirection(direction);
    }
}

Enemy.prototype.render = function (elapsedTime, ctx) {
    if (this.state == "dead") return; // shouldnt be necessary

    ctx.imageSmoothingEnabled = false;

    var position = window.tilemap.toScreenCoords(this.position);
    if (this.name != "Fucking Dragon") ctx.drawImage(
        this.spritesheet,
        96 * this.animator.index.x, 96 * this.animator.index.y,
        96, 96,
        position.x * this.size.width, position.y * this.size.height,
        96, 96
    );
    else ctx.drawImage(
        this.spritesheet,
        96 * this.animator.index.x, 96 * this.animator.index.y,
        96, 96,
        position.x * this.size.width, position.y * this.size.height,
        192, 192
    );
}

