class Game {
    constructor(fps) {
        this.animation;
        this.player1 = new Player(this, 100, 150, "pink", "Player 1", "right");
        this.player2 = new Player(this, 100, 150, "green", "Player 2", "left"); // TODO: get different controls for players
        this.canvas;
        this.context;
        this.inputsList = {};
        this.entitiesArray = [];
        this.isDone = false;
        this.winMessageEle;
        this.lastAttacker = null;
        this.winners = [];

        if (!fps)
            fps = 1000 / 60;
        else
            fps = 1000 / fps;

        this.fps = fps;
    }

    adjustForFloor(y, height) {
        let floor;

        if (!height)
            floor = this.canvas.height - y;
        else
            floor = this.canvas.height - y - height;

        return floor;
    }

    detectBoundaryCollision(x, y, entity) {
        if (x < 0 || x > (this.canvas.width - entity.width) || y < 0 || y > (this.canvas.height - entity.height))
            return true;
        else
            return false;
    }

    detectBoxCollision(box1, box2) {
        box1 = box1.positionOfPoints;
        box2 = box2.positionOfPoints;

        // WORKS, but I want to make this more efficient
        for (let i = box1.left + 1; i < box1.right; i++) {
            if (i > box2.left && i < box2.right) {
                for (let j = box1.bottom + 1; j < box1.top; j++) {
                    if (j > box2.bottom && j < box2.top)
                        return true;
                }
            }
        }
    }

    bind(canvas, winMessageEle) {
        if (typeof canvas == "string")
            this.canvas = document.getElementById(canvas);
        else
            this.canvas = canvas;

        this.context = this.canvas.getContext("2d");

        this.canvas.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                // Player 1
                case 65:
                    this.player1.inputsList["l"] = true;
                    break;
                case 68:
                    this.player1.inputsList["r"] = true;
                    break;
                case 83:
                    this.player1.inputsList["d"] = true;
                    break;
                case 32:
                    this.player1.inputsList["attack"] = true;
                    //Lock lastAttacker until action is done
                    if (!this.player1.action)
                        this.lastAttacker = this.player1;
                    break;
                // Player 2
                case 100:
                    this.player2.inputsList["l"] = true;
                    break;
                case 102:
                    this.player2.inputsList["r"] = true;
                    break;
                case 101:
                    this.player2.inputsList["d"] = true;
                    break;
                case 96:
                    this.player2.inputsList["attack"] = true;
                    //Lock lastAttacker until action is done
                    if (!this.player2.action)
                        this.lastAttacker = this.player2;
                    break;
            }

            // 'r' key for restarting game
            if (e.keyCode == "82" && this.isDone)
                this.start();
        });

        this.canvas.addEventListener("keyup", (e) => {
            switch (e.keyCode) {
                // Player 1
                case 65:
                    this.player1.inputsList["l"] = false;
                    break;
                case 68:
                    this.player1.inputsList["r"] = false;
                    break;
                case 83:
                    this.player1.inputsList["d"] = false;
                    break;
                case 32:
                    this.player1.inputsList["attack"] = false;
                    break;

                // Player 2
                case 100:
                    this.player2.inputsList["l"] = false;
                    break;
                case 102:
                    this.player2.inputsList["r"] = false;
                    break;
                case 101:
                    this.player2.inputsList["d"] = false;
                    break;
                case 96:
                    this.player2.inputsList["attack"] = false;
                    break;
            }
        });

        this.canvas.focus();

        if (typeof winMessageEle == "string")
            this.winMessageEle = document.getElementById(winMessageEle);
        else
            this.winMessageEle = winMessageEle;
    }

    start() {
        this.entitiesArray = [];
        this.winners = [];
        this.isDone = false;
        this.player1.action = null;
        this.player2.action = null;
        this.lastAttacker = null;

        this.player1.spawn(150, 0);
        this.player1.stand();

        this.player2.spawn(this.canvas.width - this.player2.width - 150, 0);
        this.player2.stand();

        this.winMessageEle.innerText = "";

        for (let i = 0; i < this.entitiesArray.length; i++) {
            this.entitiesArray[i].render();
        }

        this.animation = setInterval(this.turn.bind(this), this.fps);
    }

    turn() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.lastAttacker && this.lastAttacker.name == "Player 1") {
            this.player2.processInputs();
            this.player1.processInputs();
            this.player2.render();
            this.player1.render();
        } else {
            this.player1.processInputs();
            this.player2.processInputs();
            this.player1.render();
            this.player2.render();
        }

        let winner;

        // LOL, this is quite a mess. Gotta clean this up some time
        for (let i = 0; i < this.entitiesArray.length; i++) {
            let currentEntity = this.entitiesArray[i];
            if (currentEntity.hitboxes.length > 0) {
                for (let j = 0; j < currentEntity.hitboxes.length; j++) {
                    let currentHitbox = currentEntity.hitboxes[j];
                    for (let k = 0; k < this.entitiesArray.length; k++) {
                        let currentTarget = this.entitiesArray[k];
                        if (currentTarget.id != currentEntity.id) {
                            // TODO: Turn entity into a hurtbox
                            if (this.detectBoxCollision(currentHitbox, currentTarget))
                                winner = currentEntity;
                            for (let l = 0; l < currentTarget.hurtboxes.length; l++) {
                                if (this.detectBoxCollision(currentHitbox, currentTarget.hurtboxes[l]))
                                    winner = currentEntity;
                            }
                            if (winner)
                                this.winners.push(winner);
                        }
                    }
                }
            }
        }

        if (this.winners.length > 0) {
            this.stop();

            let str = "Winner(s): ";

            for (let i = 0; i < this.winners.length; i++)
                str += this.winners[i].name + " ";

            this.winMessageEle.innerText = str + "\n Press 'r' to restart.";
        }
    }

    stop() {
        clearInterval(this.animation);
        this.isDone = true;
    }
}