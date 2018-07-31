class Game {
    constructor(fps) {
        this.animation;
        this.player = new Player(this, 100, 150, "pink", "Player 1");
        this.player2 = new Enemy(this, 100, 150, "green", "Player 2");
        this.canvas;
        this.context;
        this.inputsList = {};
        this.entitiesArray = [];
        this.isDone = false;
        this.victoryMessageEle;

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
            if (e.keyCode == "32" || e.keyCode == "65" || e.keyCode == "68" || e.keyCode == "83" || e.keyCode == "100" || e.keyCode == "102" || e.keyCode == "101" || e.keyCode == "96") {
                this.inputsList[e.keyCode] = true;
                console.log(e.keyCode);
            }

            // r
            if (e.keyCode == "82" && this.isDone) {
                this.start();
            }
        });

        this.canvas.addEventListener("keyup", (e) => {
            if (e.keyCode == "32" || e.keyCode == "65" || e.keyCode == "68" || e.keyCode == "83" || e.keyCode == "100" || e.keyCode == "102" || e.keyCode == "101" || e.keyCode == "96") {
                this.inputsList[e.keyCode] = false;
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
        this.player.action = null;
        this.player2.action = null;

        this.player.spawn(150, 0);
        this.player.stand();

        this.player2.spawn(this.canvas.width - this.player2.width - 150, 0);
        this.player2.stand();

        this.animation = setInterval(this.turn.bind(this), this.fps);
        this.victoryMessageEle.innerText = "";
    }

    turn() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.processInputs();
        this.player2.processInputs();

        let victors = new Array();

        // TODO: Fix rendering issue where Player 1 never overlaps Player 2
        // TODO: determine who did action last
        // TODO: render that entity last
        for (let i = 0; i < this.entitiesArray.length; i++) {
            this.entitiesArray[i].render();

            if (this.entitiesArray[i].action && this.entitiesArray[i].action.hasHit) {
                victors.push(this.entitiesArray[i]);
            }
        }

        if (victors.length > 0) {
            //this.isDone = true;
            this.stop();

            let str = "Victor(s): ";

            for (let i = 0; i < victors.length; i++) {
                str += victors[i].name + " ";
            }

            this.victoryMessageEle.innerText = str + "\n Press 'r' to restart.";
        }

        console.log(victors);
    }

    stop() {
        console.log("Stopping game.");
        clearInterval(this.animation);
        this.isDone = true;
    }
}