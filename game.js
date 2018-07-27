class Game {
    constructor(fps) {
        this.animation;
        this.player = new Player(10, 10, "yellow");
        this.canvas;
        this.context;
        this.inputsList = {};
        if(!fps){
            fps = 1000/60;
        } else {
            fps = 1000/fps;
        }

        this.fps = fps;
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
        //this.player.attack();

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