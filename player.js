/* 
    TODO:
    * Hit detection
    * hurtboxes
*/

class Player extends Entity {
    constructor(game, width, height, appearance) {
        super(game, width, height, appearance);
        this.state = "neutral";
        this.action = null;
        this.movementSpeed = 8;
        
        // TODO: Track active hitboxes and hurtboxes
        //this.hitboxes;
        //this.hurtboxes;

        // this.hurtboxes?
        // make moveset
        // stand move that has long range but poor recovery
        // crouch move that has shorter range, but good recovery
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
            console.log("active frames");

            // track which hitboxes are active using Player.hitbox array? OR do collision detection right here with these instances of hitbox and hurtbox
            let hitbox = new Hitbox(this, 100, 50, this.positionX + (this.width / 2), this.positionY + (this.height / 2) - (50 / 2), 1);
            hitbox.render();

            let diff = 10;
            let hurtbox = new Hurtbox(this, hitbox.width - diff, hitbox.height - diff, hitbox.positionX, hitbox.positionY + diff / 2);
            hurtbox.render();
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

    // Overrides Entity.move()
    move(x, y) {
        if (this.state == "neutral") {
            let newPositionX = this.positionX + x;
            let newPositionY = this.positionY + y;

            // Turn into new function repositionInBounds?
            if (this.game.detectBoundaryCollision(newPositionX, newPositionY, this)) {

                if (newPositionX < 0)
                    newPositionX = 0;
                else if (newPositionX > (this.game.canvas.width - this.width))
                    newPositionX = this.game.canvas.width - this.width;

                if (newPositionY < 0)
                    newPositionY = 0;
                else if (newPositionY > (this.game.canvas.height - this.height))
                    newPositionY = this.game.canvas.height - this.height;
            }

            this.positionX = newPositionX;
            this.positionY = newPositionY;
        }
    }
}