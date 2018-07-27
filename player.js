
class Player {
    constructor(game, width, height, appearance) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.appearance = appearance;
        this.state = "neutral";
        this.action = null;
        this.positionX;
        this.positionY;
    }

    spawn(x, y) {
        this.positionX = x;
        this.positionY = y;

        this.move(0, 0);
    }

    move(x, y) {
        let newPositionX = this.positionX + x;
        let newPositionY = this.positionY + y;

        // Turn into new function repositionInBounds?
        if (this.game.detectBoundaryCollision(newPositionX, newPositionY, this)) {

            // Move to move()?
            if (newPositionX < 0) {
                newPositionX = 0;
            } else if (newPositionX > (this.game.canvas.width - this.width)) {
                newPositionX = this.game.canvas.width - this.width;
            }

            if (newPositionY < 0) {
                newPositionY = 0;
            } else if (newPositionY > (this.game.canvas.height - this.height)) {
                newPositionY = this.game.canvas.height - this.height;
            }
        }

        this.positionX = newPositionX;
        this.positionY = newPositionY;
    }

    processAction() {
        //console.log("this.action:",this.action);
        //console.log("state:", this.state);
        if (this.action) {
            //console.log("this.action:", this.action);
            if (this.action.isDone) {
                //console.log("Player.action was:", this.action);
                this.state = "neutral";
                this.action = null;
                //console.log("Player.action is now:", this.action);
            } else {
                this.action.execute();
            }
        } else {
            //console.log("Player.action is false.");
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
            // form hitbox
        });

        let recovery = new Effect(/*this,*/ 8, () => {
            //this.state = "recovering";
            //console.log(this.state);
            console.log("recovery frames");
            // remove hitbox
        });

        if (this.state == "neutral") {
            console.log("Launching attack!");
            this.state = "attacking";
            this.action = new Action(startup, active, recovery);
        }
    }

    render() {
        this.game.context.beginPath();
        this.game.context.fillStyle = this.appearance;
        this.game.context.fillRect(this.positionX, this.game.adjustForFloor(this.positionY, this.height), this.width, this.height);
    }

    get positionOfPoints() {
        let left = this.positionX;
        let right = this.positionX + this.width;
        let top = this.positionY + this.height;
        let bottom = this.positionY;

        return { left: left, right: right, top: top, bottom: bottom };
    }
}