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
        this.victoryMessageEle;

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
                    if (j >= box2.bottom && j <= box2.top) {
                        console.log("COLLISION DETECTED AT x:", i, "y:", j);
                        return true;
                    }
                }
            }
        }
    }

    bind(canvas, victoryMessageEle) {
        if (typeof canvas == "string")
            this.canvas = document.getElementById(canvas);
        else
            this.canvas = canvas;

        this.context = this.canvas.getContext("2d");

        // TODO: move into Game.start and move Game.inputsList to Player
        this.canvas.addEventListener("keydown", (e) => {

            // l, r, d, attack
            /*if (e.keyCode == "65" || e.keyCode == "68" || e.keyCode == "83" || e.keyCode == "32") {
                this.player1.inputsList[e.keyCode] = true;
                console.log(this.player1.inputsList);
            }*/
            console.log(e.keyCode);
            switch (e.keyCode) {
                case 65:
                    this.player1.inputsList["l"] = true;
                    this.lastActor = this.player1;
                    console.log("p1 left");
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


            // l, r, d, attack
            //if (e.keyCode == "100" || e.keyCode == "102" || e.keyCode == "101" || e.keyCode == "96") {
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
            //this.player2.inputsList[e.keyCode] = true;
            //console.log(this.player2.inputsList);
            //}

            // 'r' key, restart

            if (e.keyCode == "82" && this.isDone) {
                this.start();
            }
        });

        this.canvas.addEventListener("keyup", (e) => {
            /*if (e.keyCode == "32" || e.keyCode == "65" || e.keyCode == "68" || e.keyCode == "83") {
                this.player1.inputsList[e.keyCode] = false;
            }*/

            /*
            if (e.keyCode == "100" || e.keyCode == "102" || e.keyCode == "101" || e.keyCode == "96") {
                this.player2.inputsList[e.keyCode] = false;
            }*/

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

        if (typeof victoryMessageEle == "string") {
            this.victoryMessageEle = document.getElementById(victoryMessageEle);
        } else {
            this.victoryMessageEle = victoryMessageEle;
        }
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
        this.victoryMessageEle.innerText = "";
    }

    turn() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Order of processInputs linked to ghost whiff punish bug
        //this.player.processInputs();
        //this.player2.processInputs();

        //onsole.log("LA:", this.lastActor);

        let victors = new Array();

        // Ghost hit bug
        // Hmm, detects hit, saves victor
        // then tries 2p action
        // BUT processInputs clears existing hurtbox which p1 already hit
        // then renders
        // looks like ghost hit 
        for (let i = 0; i < this.entitiesArray.length; i++) {
            this.entitiesArray[i].processInputs();
            //this.entitiesArray[i].render();

            if (this.entitiesArray[i].action && this.entitiesArray[i].action.hasHit) {
                victors.push(this.entitiesArray[i]);
            }
        }

        if (this.lastActor && this.lastActor.name == "Player 1") {
            console.log("LA:", this.lastActor);
            this.player2.render();
            this.player1.render();
        } else {
            this.player1.render();
            this.player2.render();
        }

        if (victors.length > 0) {
            this.stop();

            let str = "Victor(s): ";

            for (let i = 0; i < victors.length; i++) {
                str += victors[i].name + " ";
            }

            this.victoryMessageEle.innerText = str + "\n Press 'r' to restart.";
        }
    }

    stop() {
        console.log("Stopping game.");
        clearInterval(this.animation);
        this.isDone = true;
    }
}