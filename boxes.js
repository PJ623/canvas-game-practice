// Lol, now this is getting out of hand
class Box extends Entity {
    constructor(player, width, height, appearance, positionX, positionY) {
        super(player.game, width, height, appearance);
        this.positionX = positionX;
        this.positionY = positionY;
        this.player = player;
    }
}

class Hurtbox extends Box {
    constructor(player, width, height, positionX, positionY) {
        super(player, width, height, player.appearance, positionX, positionY);
    }
}

class Hitbox extends Box {
    constructor(player, width, height, positionX, positionY, damage) {
        super(player, width, height, "red", positionX, positionY);
        this.damage = damage;
    }
}