/* Tentative Title: Pokey */

class Game {
    constructor(fps) {
        this.animation;
        this.player = new Player(this, 100, 150, "yellow");
        this.canvas;
        this.context;
        this.inputsList = {};

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

    bind(canvas) {
        if (typeof canvas == "string")
            this.canvas = document.getElementById(canvas);
        else
            this.canvas = canvas;

        this.context = this.canvas.getContext("2d");

        this.canvas.addEventListener("keydown", (e) => {
            if (e.keyCode == "32" || e.keyCode == "65" || e.keyCode == "68") {
                this.inputsList[e.keyCode] = true;
            }
        });

        this.canvas.addEventListener("keyup", (e) => {
            if (e.keyCode == "32" || e.keyCode == "65" || e.keyCode == "68") {
                this.inputsList[e.keyCode] = false;
            }
        });

        this.canvas.focus();
    }

    start() {
        console.log("Starting game.");
        this.player.spawn(0, 0);
        this.animation = setInterval(this.turn.bind(this), this.fps);
    }

    turn() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let input in this.inputsList) {
            switch (input) {
                case "32":
                    if (this.inputsList[input])
                        this.player.attack();
                    break;
                case "65":
                    if (this.inputsList[input]) {
                        this.player.move(-this.player.movementSpeed, 0);
                    }
                    break;
                case "68":
                    if (this.inputsList[input]) {
                        this.player.move(this.player.movementSpeed, 0);
                    }
                    break;
            }
        }

        // render all entities instead
        // ordered so processAction hitboxes are rendered on top of player render
        this.player.render();
        this.player.processAction();
    }

    stop() {
        console.log("Stopping game.");
        clearInterval(this.animation);
    }
}