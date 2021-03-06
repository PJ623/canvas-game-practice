class Player extends Entity {
    constructor(game, width, height, appearance, name, facing) {
        super(game, width, height, appearance);
        this.state = "standing";
        this.action = null;
        this.movementSpeed = 5;
        this.name = name;

        this.hitboxes = [];
        this.hurtboxes = [];

        this.standingHeight = this.height;
        this.standingWidth = this.width;

        this.inputsList = {};

        this.facing = facing;
    }

    processInputs() {
        this.hitboxes = [];
        this.hurtboxes = [];

        let speedX = 0;
        let speedY = 0;

        if (this.inputsList["l"])
            speedX += -this.movementSpeed;

        if (this.inputsList["r"])
            speedX += this.movementSpeed;

        //s. placed later to override speeds from a or d
        if (this.inputsList["d"]) {
            speedX = 0;
            speedY = 0;
            if (!this.action)
                this.crouch();
        } else {
            if (!this.action)
                this.stand();
        }

        // space
        if (this.inputsList["attack"])
            this.attack();

        this.move(speedX, speedY);

        if (this.action) {
            if (this.action.isDone) {
                if (this.height < this.standingHeight)
                    this.crouch();
                else
                    this.stand();
                this.action = null;
            } else {
                this.action.execute();
            }
        }
    }

    // TODO: Restructure/revamp this sometime
    attack() {
        let startup;
        let active;
        let recovery;
        let hitbox;
        let hurtbox;
        let diff;

        // MESSY Move into Box?
        let offsetX = function (width) {
            if (this.facing == "right")
                return this.width;
            else if (this.facing == "left")
                return -width;
        }

        let offsetWithDiff = function (diff) {
            if (this.facing == "left")
                return diff;
            else if (this.facing == "right")
                return 0;
        }

        let offsetFromMiddle = function () {
            if (this.facing == "left")
                return this.width / 2;
            else if (this.facing == "right")
                return -this.width / 2;
        }

        // Standing attack
        if (this.state == "standing") {
            startup = new Effect(5, () => {
                hurtbox = new Hurtbox(this, 40, 60, this.positionX + offsetX.call(this, 40), this.positionY + (this.height / 2) - (60 / 2));
                this.hurtboxes.push(hurtbox);
            });

            active = new Effect(2, () => {
                hitbox = new Hitbox(this, 80, 60, this.positionX + offsetX.call(this, 80), this.positionY + (this.height / 2) - (60 / 2), 1);
                this.hitboxes.push(hitbox);

                diff = 20;
                hurtbox = new Hurtbox(this, hitbox.width - diff, hitbox.height - diff, hitbox.positionX + offsetWithDiff.call(this, diff) /* +diff or +0 depending on which side facing*/, hitbox.positionY + diff / 2);
                this.hurtboxes.push(hurtbox);
            });

            recovery = new Effect(8, () => {
                hurtbox = new Hurtbox(this, 40, 60, this.positionX + offsetX.call(this, 40), this.positionY + (this.height / 2) - (60 / 2));
                this.hurtboxes.push(hurtbox);
            });
        }

        // Crouching attack
        if (this.state == "crouching") {
            startup = new Effect(8, () => {
                hurtbox = new Hurtbox(this, 100, this.height - 10, this.positionX + (offsetX.call(this, 100) / 2), this.positionY);
                this.hurtboxes.push(hurtbox);
            });

            active = new Effect(4, () => {
                hitbox = new Hitbox(this, 150, 50, this.positionX + offsetX.call(this, 150) + offsetFromMiddle.call(this), this.positionY /*+ (this.height / 2) - (50 / 2)*/, 1);
                this.hitboxes.push(hitbox);

                diff = 20;
                hurtbox = new Hurtbox(this, hitbox.width - diff, hitbox.height - diff, hitbox.positionX + offsetWithDiff.call(this, diff), hitbox.positionY);
                this.hurtboxes.push(hurtbox);
            });

            recovery = new Effect(14, () => {
                hurtbox = new Hurtbox(this, 100, 50, this.positionX + offsetX.call(this, 110) + offsetFromMiddle.call(this), this.positionY);
                this.hurtboxes.push(hurtbox);
            });
        }

        if (this.state == "standing" || this.state == "crouching") {
            this.state = "attacking";
            this.action = new Action(startup, active, recovery);
        }
    }

    crouch() {
        this.height = this.standingHeight / 2;
        this.state = "crouching";
    }

    stand() {
        this.height = this.standingHeight;
        this.width = this.standingWidth;
        this.state = "standing";
    }

    move(x, y) {
        if (this.state == "standing" || this.state == "crouching") {
            let newPositionX = this.positionX + x;
            let newPositionY = this.positionY + y;

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

                    break;
                }
            }

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

    // @Override Entity.render
    render() {
        this.game.context.beginPath();
        this.game.context.fillStyle = this.appearance;
        this.game.context.fillRect(this.positionX, this.game.adjustForFloor(this.positionY, this.height), this.width, this.height);

        if (this.hitboxes.length > 0) {
            for (let i = 0; i < this.hitboxes.length; i++)
                this.hitboxes[i].render();
        }

        if (this.hurtboxes.length > 0) {
            for (let i = 0; i < this.hurtboxes.length; i++)
                this.hurtboxes[i].render();
        }
    }
}