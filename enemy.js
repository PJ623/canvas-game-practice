class Enemy extends Player {
    constructor(game, width, height, appearance, name) {
        super(game, width, height, appearance, name);
        this.state = "standing";
        this.action = null;
        this.movementSpeed = 6;

        this.hitboxes = [];
        this.hurtboxes = [];

        this.standingHeight = this.height;
        this.standingWidth = this.width;
    }

    processInputs() {
        this.hitboxes = [];
        this.hurtboxes = [];

        let speedX = 0;
        let speedY = 0;

        // a
        if (this.game.inputsList["100"]) {
            speedX += -this.movementSpeed;
        }

        // d
        if (this.game.inputsList["102"]) {
            speedX += this.movementSpeed;
        }

        //s. placed later to override speeds from a or d
        if (this.game.inputsList["101"]) {
            speedX = 0;
            speedY = 0;
            if (!this.action) {
                this.crouch();
            }
        } else {
            if (!this.action) {
                this.stand();
            }
        }

        // space
        if (this.game.inputsList["96"]) {
            this.attack();
        }

        this.move(speedX, speedY);

        if (this.action) {
            if (this.action.isDone) {
                if (this.height < this.standingHeight) {
                    this.crouch();
                } else {
                    this.stand();
                }
                this.action = null;
            } else {
                this.action.execute();
            }
        }
    }

    //jump()?

    attack() {
        //let hitLanded;
        let startup;
        let active;
        let recovery;
        let hitbox;
        let hurtbox;

        let diff;

        let detectHit = function (hitbox) {
            for (let i = 0; i < this.game.entitiesArray.length; i++) {
                if (this.game.entitiesArray[i].id != this.id) {
                    // put this into hurtbox checks later lol. looks so redundant
                    if (this.game.detectBoxCollision(hitbox, this.game.entitiesArray[i])) {
                        this.action.hasHit = true;
                        console.log("End the game already!");
                    }
                    for (let j = 0; j < this.game.entitiesArray[i].hurtboxes.length; j++) {
                        if (this.game.detectBoxCollision(hitbox, this.game.entitiesArray[i].hurtboxes[j])) {
                            this.action.hasHit = true;
                            console.log("End the game already!");
                        }
                    }
                }
            }
        }

        // Standing attack
        if (this.state == "standing") {
            startup = new Effect(5, () => {
                //console.log("startup frames");
                hurtbox = new Hurtbox(this, 40, 60, this.positionX - 40, this.positionY + (this.height / 2) - (60 / 2));
                this.hurtboxes.push(hurtbox);
                // alter hurtbox?
                // TODO: maybe turn currentframe into currentframe from start of effect?
            });

            active = new Effect(3, () => {
                //console.log("active frames");

                // track which hitboxes are active using Player.hitbox array? OR do collision detection right here with these instances of hitbox and hurtbox
                hitbox = new Hitbox(this, 80, 60, this.positionX - 80, this.positionY + (this.height / 2) - (60 / 2), 1);
                this.hitboxes.push(hitbox);

                diff = 20;
                hurtbox = new Hurtbox(this, hitbox.width - diff, hitbox.height - diff, hitbox.positionX + diff, hitbox.positionY + diff / 2);
                this.hurtboxes.push(hurtbox);

                detectHit.call(this, hitbox);
            });

            recovery = new Effect(6, () => {
                //console.log("recovery frames");
                hurtbox = new Hurtbox(this, 40, 60, this.positionX - 40, this.positionY + (this.height / 2) - (60 / 2));
                this.hurtboxes.push(hurtbox);
            });
        }

        // Crouching attack
        if (this.state == "crouching") {
            startup = new Effect(10, (currentFrameForSegment) => {
                console.log("startup frames");
                // alter hurtbox?
                hurtbox = new Hurtbox(this, 100, this.height - 10, this.positionX - (100 / 2), this.positionY);
                this.hurtboxes.push(hurtbox);

                if (currentFrameForSegment == 2) {
                    console.log("HOLLA AT YO BOI");
                }
            });

            active = new Effect(5, () => {
                console.log("active frames");

                // track which hitboxes are active using Player.hitbox array? OR do collision detection right here with these instances of hitbox and hurtbox
                hitbox = new Hitbox(this, 150, 50, this.positionX - (150 - this.width / 2), this.positionY /*+ (this.height / 2) - (50 / 2)*/, 1);
                this.hitboxes.push(hitbox);

                diff = 10;
                hurtbox = new Hurtbox(this, hitbox.width - diff, hitbox.height - diff, hitbox.positionX + diff, hitbox.positionY);
                this.hurtboxes.push(hurtbox);

                detectHit.call(this, hitbox)
            });

            recovery = new Effect(15, () => {
                hurtbox = new Hurtbox(this, 110, 50, this.positionX - (110 - this.width / 2), this.positionY);
                this.hurtboxes.push(hurtbox);
                console.log("recovery frames");
            });
        }

        if (this.state == "standing" || this.state == "crouching") {
            this.state = "attacking";
            this.action = new Action(startup, active, recovery);
        }
    }
}