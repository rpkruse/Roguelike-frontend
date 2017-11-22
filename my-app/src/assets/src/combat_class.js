"use strict";

const Tilemap = require('./tilemap');
const Vector = require('./vector');
const RNG = require("./rng");

// weapon/armor shouldnt be done here...
// they can still be stored here if necessary, but
// I think it might make more sense to have them
// directly on the player/enemy?
const Weapon = require("./weapon");
const Armor = require("./armor");

module.exports = exports = CombatClass;

function CombatClass(aName, aLevel) {
    this.name = aName;
    this.difficulty = window.combatController.getDifficulty(aLevel);
    // set up random ish weapons/armor for enemies

    var classData = window.data.classes.find(function(x){ return x.name == aName});
    var weaponName = window.data.weapons.find(function(x){ return x.id == classData.starting_weapon}).name;
    var armorName = window.data.armors.find(function(x){ return x.id == classData.starting_armor }).name;

    this.health = classData.starting_health;
    this.attackBonus = classData.starting_attack_bonus;
    this.damageBonus = classData.starting_damage_bonus;
    this.defenseBonus = classData.starting_defense_bonus;
    this.weapon = new Weapon(weaponName, aLevel);
    this.armor = new Armor(armorName, aLevel);
    this.status = { effect: "None", timer: 0 };
    this.options = {};
    if(classData.options != "") {
        this.options = JSON.parse(classData.options);
    }


    switch (aName) {
        case "Zombie": 
        case "Skeleton": 
        case "Minotaur": 
        case "Shaman":
        case "Fucking Dragon":
            this.health = Math.max(classData.starting_health, classData.starting_health * this.difficulty);
            this.attackBonus = this.difficulty + classData.starting_attack_bonus;
            this.damageBonus = this.difficulty + classData.starting_damage_bonus;
            this.defenseBonus = this.difficulty + classData.starting_defense_bonus;
            break;
    }

    switch (aName) {
        case "Zombie":
            var senseRange = this.options.sense_range;

            this.turnAI = function (aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);
                if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                    aEnemy.playAttack();
                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                } else if (distance.x <= senseRange && distance.y <= senseRange) {
                    aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                } else {
                    var nextTile = window.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                }
            }
            break;

        case "Skeleton":
            var senseRange = this.options.sense_range;
            var prefDist = this.options.prefDist;
            var attackCooldown = this.options.attackCooldown;
            var moveOrAttack = this.options.moveOrAttack;

            this.turnAI = function (aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);

                if (distance.x > senseRange && distance.y > senseRange) {
                    var nextTile = window.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                } else {
                    if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                        var path = pathfinder.findPath(aEnemy.position, aEnemy.target.position);
                        var LoS = Vector.magnitude(distance) * 2 >= path.length;
                        if (LoS) {
                            if (moveOrAttack) {
                                if (attackCooldown <= 0) {
                                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                                    attackCooldown = 2;
                                }
                                moveOrAttack = 0;
                            } else {
                                if (distance.x < prefDist && distance.y < prefDist) {
                                    aEnemy.position = moveBack(aEnemy.position, aEnemy.target.position, window.tilemap.getRandomAdjacentArray(aEnemy.position));
                                } else if (distance.x >= prefDist && distance.y >= prefDist) {
                                    aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                                }
                                moveOrAttack = 1;
                                attackCooldown = 1;
                            }
                            attackCooldown--;
                        } else {
                            aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                        }
                    } else {
                        aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                    }
                }
            }
            break;

        case "Minotaur":
            var senseRange = this.options.sense_range;

            this.turnAI = function (aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);
                if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                    aEnemy.playAttack();
                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                } else if (distance.x <= senseRange && distance.y <= senseRange) {
                    aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                } else {
                    var nextTile = window.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                }
            }
            break;

        case "Shaman":
            var senseRange = this.options.sense_range;
            var prefDist = this.options.prefDist;
            var attackCooldown = this.options.attackCooldown;
            var moveOrAttack = this.options.moveOrAttack;

            this.turnAI = function (aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);

                if (distance.x > senseRange && distance.y > senseRange) {
                    var nextTile = window.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                } else {
                    if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                        var path = pathfinder.findPath(aEnemy.position, aEnemy.target.position);
                        var LoS = Vector.magnitude(distance) * 2 >= path.length;
                        if (LoS) {
                            if (moveOrAttack) {
                                if (attackCooldown <= 0) {
                                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                                    attackCooldown = 2;
                                }
                                moveOrAttack = 0;
                            } else {
                                if (distance.x < prefDist && distance.y < prefDist) {
                                    aEnemy.position = moveBack(aEnemy.position, aEnemy.target.position, window.tilemap.getRandomAdjacentArray(aEnemy.position));
                                } else if (distance.x >= prefDist && distance.y >= prefDist) {
                                    aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                                }
                                moveOrAttack = 1;
                                attackCooldown = 1;
                            }
                            attackCooldown--;
                        } else {
                            aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                        }
                    } else {
                        aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                    }
                }
            }
            break;

        case "Fucking Dragon":
            var senseRange = this.options.sense_range;
            var prefDist = this.options.prefDist;
            var attackCooldown = this.options.attackCooldown;
            var moveOrAttack = this.options.moveOrAttack;

            this.turnAI = function (aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);

                if (distance.x > senseRange && distance.y > senseRange) {
                    var nextTile = aEnemy.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                } else {
                    if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                        var path = pathfinder.findPath(aEnemy.position, aEnemy.target.position);
                        var LoS = Vector.magnitude(distance) * 2 >= path.length;
                        if (LoS) {
                            if (moveOrAttack) {
                                if (attackCooldown <= 0) {
                                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                                    attackCooldown = 2;
                                }
                                moveOrAttack = 0;
                            } else {
                                if (distance.x < prefDist && distance.y < prefDist) {
                                    aEnemy.position = moveBack(aEnemy.position, aEnemy.target.position, aEnemy.tilemap.getRandomAdjacentArray(aEnemy.position));
                                } else if (distance.x >= prefDist && distance.y >= prefDist) {
                                    aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                                }
                                moveOrAttack = 1;
                                attackCooldown = 1;
                            }
                            attackCooldown--;
                        } else {
                            aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                        }
                    } else {
                        aEnemy.position = moveToward(aEnemy.position, aEnemy.target.position);
                    }
                }
            }

            break;
    }

}

function moveBack(a, b, array) {
    var adj;

    if (a.x < b.x && a.y < b.y) { adj = array.filter(tile => tile.x < a.x && tile.y < a.y) }
    else if (a.x == b.x && a.y < b.y) { adj = array.filter(tile => tile.x == a.x && tile.y < a.y) }
    else if (a.x > b.x && a.y < b.y) { adj = array.filter(tile => tile.x > a.x && tile.y < a.y) }
    else if (a.x < b.x && a.y == b.y) { adj = array.filter(tile => tile.x < a.x && tile.y == a.y) }
    else if (a.x > b.x && a.y == b.y) { adj = array.filter(tile => tile.x > a.x && tile.y == a.y) }
    else if (a.x < b.x && a.y > b.y) { adj = array.filter(tile => tile.x < a.x && tile.y > a.y) }
    else if (a.x == b.x && a.y > b.y) { adj = array.filter(tile => tile.x == a.x && tile.y > a.y) }
    else if (a.x > b.x && a.y > b.y) { adj = array.filter(tile => tile.x > a.x && tile.y > a.y) }
    else return { x: a.x, y: a.y };

    if (adj.length == 0) return { x: a.x, y: a.y };
    else {
        var newPos = adj[RNG.rollRandom(0, adj.length - 1)];
        return { x: newPos.x, y: newPos.y };
    }
}

function moveToward(a, b) {
    var path = pathfinder.findPath(a, b);
    if (path.length > 1) return { x: path[1].x, y: path[1].y };
    else return a;
}
