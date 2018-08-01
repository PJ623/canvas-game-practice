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
        this.lastActor = null;

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
        for (let i = box1.left; i < box1.right; i++) {
            if (i >= box2.left && i <= box2.right) {
                for (let j = box1.bottom; j < box1.top; j++) {
                    if (j >= box2.bottom && j <= box2.top)
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
                case 65:
                    // Lots of similar code. Package in a function later?
                    this.player1.inputsList["l"] = true;
                    this.lastActor = this.player1;
                    break;
                case 68:
                    this.player1.inputsList["r"] = true;
                    this.lastActor = this.player1;
                    break;
                case 83:
                    this.player1.inputsList["d"] = true;
                    this.lastActor = this.player1;
                    break;
                case 32:
                    this.player1.inputsList["attack"] = true;
                    this.lastActor = this.player1;
                    break;
            }

            switch (e.keyCode) {
                case 100:
                    this.player2.inputsList["l"] = true;
                    this.lastActor = this.player2;
                    break;
                case 102:
                    this.player2.inputsList["r"] = true;
                    this.lastActor = this.player2;
                    break;
                case 101:
                    this.player2.inputsList["d"] = true;
                    this.lastActor = this.player2;
                    break;
                case 96:
                    this.player2.inputsList["attack"] = true;
                    this.lastActor = this.player2;
                    break;
            }

            // 'r' key for restarting game
            if (e.keyCode == "82" && this.isDone)
                this.start();
        });

        this.canvas.addEventListener("keyup", (e) => {
            switch (e.keyCode) {
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
            }

            switch (e.keyCode) {
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
        console.log("Starting game.");
        this.entitiesArray = [];

        this.isDone = false;
        this.player1.action = null;
        this.player2.action = null;

        this.player1.spawn(150, 0);
        this.player1.stand();

        this.player2.spawn(this.canvas.width - this.player2.width - 150, 0);
        this.player2.stand();

        this.animation = setInterval(this.turn.bind(this), this.fps);
        this.winMessageEle.innerText = "";
    }

    turn() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Order of processInputs linked to ghost whiff punish bug
        //this.player.processInputs();
        //this.player2.processInputs();

        // Ghost whiff punish bug
        // Hmm, detects hit, saves victor
        // then tries 2p action
        // BUT processInputs clears existing hurtbox which p1 already hit
        // then renders
        // looks like ghost hit 

        if (this.lastActor && this.lastActor.name == "Player 1") {
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

        let winners = new Array();

        for (let i = 0; i < this.entitiesArray.length; i++) {
            if (this.entitiesArray[i].action && this.entitiesArray[i].action.hasHit)
                winners.push(this.entitiesArray[i]);
        }

        if (winners.length > 0) {
            this.stop();

            let str = "Winner(s): ";

            for (let i = 0; i < winners.length; i++)
                str += winners[i].name + " ";

            this.winMessageEle.innerText = str + "\n Press 'r' to restart.";
        }
    }

    stop() {
        console.log("Stopping game.");
        clearInterval(this.animation);
        this.isDone = true;
    }
}