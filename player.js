class Player extends Entity {
    constructor(game, width, height, appearance) {
        super(game, width, height, appearance);
        this.state = "neutral";
        this.action = null;
        this.movementSpeed = 8;

        this.hitboxes = [];
        this.hurtboxes = [];

        // TODO:
        // Side switching

        // make moveset
        // stand move that has long range but poor recovery
        // crouch move that has shorter range, but good recovery
    }

    processInputs() {
        this.hitboxes = [];
        this.hurtboxes = [];

        let speedX = 0;
        let speedY = 0;

        // space
        if (this.game.inputsList["32"]) {
            this.attack();
        }

        // a
        if (this.game.inputsList["65"]) {
            speedX += -this.movementSpeed;
        }

        // d
        if (this.game.inputsList["68"]) {
            speedX += this.movementSpeed;
        }

        //s. placed later to override speeds from a or d
        if (this.game.inputsList["83"]) {
            speedX = 0;
            speedY = 0;
            //this.player.crouch();
        }

        this.move(speedX, speedY);

        if (this.action) {
            if (this.action.isDone) {
                this.state = "neutral";
                this.action = null;
            } else {
                this.action.execute();
            }
        }
    }

    attack() {
        //let hitLanded;

        let startup = new Effect(/*this,*/ 5, () => {
            console.log("startup frames");
            // alter hurtbox?
        });

        let active = new Effect(/*this,*/ 3, () => {
            console.log("active frames");

            // track which hitboxes are active using Player.hitbox array? OR do collision detection right here with these instances of hitbox and hurtbox
            let hitbox = new Hitbox(this, 100, 50, this.positionX + (this.width / 2), this.positionY + (this.height / 2) - (50 / 2), 1);
            this.hitboxes.push(hitbox);

            let diff = 10;
            let hurtbox = new Hurtbox(this, hitbox.width - diff, hitbox.height - diff, hitbox.positionX, hitbox.positionY + diff / 2);
            this.hurtboxes.push(hurtbox);

            // temp
            /*if(hitLanded){

            }*/
            for (let i = 0; i < this.game.entitiesArray.length; i++) {
                if (this.game.entitiesArray[i].id != this.id) {
                    this.game.detectBoxCollision(this.hitboxes[0], this.game.entitiesArray[i]);
                }
            }
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

    // @Override Entity.move()
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

            for (let i = 0; i < this.game.entitiesArray.length; i++) {
                if (this.game.entitiesArray[i].id != this.id && this.game.detectBoxCollision(this, this.game.entitiesArray[i])) {
                    let thisPoints = this.positionOfPoints;
                    let entityPoints = this.game.entitiesArray[i].positionOfPoints;

                    let differenceToLeft = entityPoints.left - (thisPoints.right + x);
                    let differenceToRight = entityPoints.right - (thisPoints.left + x);

                    if (differenceToLeft < 0)
                        differenceToLeft = differenceToLeft * (-1);

                    if (differenceToRight < 0)
                        differenceToRight = differenceToRight * (-1);

                    if (differenceToLeft < differenceToRight)
                        newPositionX = entityPoints.left - this.width - 1;
                    else
                        newPositionX = entityPoints.right + 1;

                    break; // push mover into non-occupied position
                }
            }

            this.positionX = newPositionX;
            this.positionY = newPositionY;
        }
    }

    // @Override Entity.render
    render() {
        this.game.context.beginPath();
        this.game.context.fillStyle = this.appearance;
        this.game.context.fillRect(this.positionX, this.game.adjustForFloor(this.positionY, this.height), this.width, this.height);

        if (this.hitboxes.length > 0) {
            for (let i = 0; i < this.hitboxes.length; i++) {
                this.game.context.beginPath();
                this.hitboxes[i].render();
            }
        }

        if (this.hurtboxes.length > 0) {
            for (let i = 0; i < this.hitboxes.length; i++) {
                this.game.context.beginPath();
                this.hurtboxes[i].render();
            }
        }
    }
}