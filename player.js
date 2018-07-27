class Player extends Entity {
    constructor(game, width, height, appearance) {
        super(game, width, height, appearance);
        this.state = "neutral";
        this.action = null;
    }

    processAction() {
        if (this.action) {
            if (this.action.isDone) {
                this.state = "neutral";
                this.action = null;
            } else {
                this.action.execute();
            }
        }
    }

    // Make hitboxes
    attack() {
        let startup = new Effect(/*this,*/ 5, () => {
            console.log("startup frames");
            // alter hurtbox?
        });

        let active = new Effect(/*this,*/ 3, () => {
            let hitbox = new Hitbox(this.game, 100, 50, "red", 1);

            console.log("active frames");

            // form hitbox
            hitbox.positionX = this.positionX + (this.width / 2);
            hitbox.positionY = this.positionY + (this.height / 2);

            // render hitbox
            this.game.context.beginPath();
            this.game.context.fillStyle = "red";
            this.game.context.fillRect(hitbox.positionX, this.game.adjustForFloor(hitbox.positionY), hitbox.width, hitbox.height);

            // hitting logic
        });

        let recovery = new Effect(/*this,*/ 8, () => {
            //this.state = "recovering";
            console.log("recovery frames");
            // remove hitbox
            // hitbox already gone? check somehow
        });

        if (this.state == "neutral") {
            console.log("Launching attack!");
            this.state = "attacking";
            this.action = new Action(startup, active, recovery);
        }
    }
}