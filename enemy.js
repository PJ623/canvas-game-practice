class Enemy extends Entity {
    constructor(game, width, height /*, appearance*/){
        super(game, width, height, "green");
        this.hitboxes;
        this.hurtboxes;
    }

    // emulate random behavior
    // extend from Player
    // change controls, change positions of attacks for right hand side

    // already has Entity.move, Entity.render, Entity.positionOfPoints, Entity.spawn
}