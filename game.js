class Game {
    constructor(fps) {
        this.animation;
        this.player = new Player(this, 100, 150, "yellow");
        this.canvas;
        this.context;
        this.inputsList = {};
        if (!fps) {
            fps = 1000 / 60;
        } else {
            fps = 1000 / fps;
        }

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

    // Take in newPositionX, and newPositionY
    detectBoundaryCollision(x, y, entity){
        if(x < 0 || x > (this.canvas.width - entity.width) || y < 0 || y > (this.canvas.height - entity.height)){
            // relocate to move?
            //entity.positionX =this.canvas.width-entity.width;
            return false;
        } else {
            return true;
        }
    }

    bind(canvas) {
        if (typeof canvas == "string")
            this.canvas = document.getElementById(canvas);
        else
            this.canvas = canvas;

        this.context = this.canvas.getContext("2d");

        this.canvas.addEventListener("keydown", (e) => {
            if (e.keyCode == "32") {
                this.inputsList[e.keyCode] = true;
            }
        });

        this.canvas.addEventListener("keyup", (e) => {
            if (e.keyCode == "32") {
                this.inputsList[e.keyCode] = false;
            }
        });

        // doesn't seem to work in FireFox?
        this.canvas.focus();
    }

    start() {
        console.log("Starting game.");
        this.animation = setInterval(this.turn.bind(this), this.fps);
    }

    turn() {
        for (let input in this.inputsList) {
            switch (input) {
                case "32":
                    if (this.inputsList[input]) {
                        this.player.attack();
                    }
                    break;
            }
        }

        this.player.checkState();
    }

    stop() {
        console.log("Stopping game.");
        clearInterval(this.animation);
    }
}