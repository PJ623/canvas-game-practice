class Enemy extends Entity {
    constructor(game, width, height /*, appearance*/){
        super(game, width, height, "green");
        this.hitboxes;
        this.hurtboxes;
    }
    // already has Entity.move, Entity.render, Entity.positionOfPoints, Entity.spawn
}