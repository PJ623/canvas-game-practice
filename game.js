/* Tentative Title: Pokey or TAG game with lots of movement*/

class Game {
    constructor(fps) {
        this.animation;
        this.player = new Player(this, 100, 150, "yellow");
        this.canvas;
        this.context;
        this.inputsList = {};
        this.entitiesArray = [];

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

    detectBoxCollision(hitbox, hurtbox) {
        hitbox = hitbox.positionOfPoints;
        hurtbox = hurtbox.positionOfPoints;

        // WORKS, but I want to make this more efficient
        for (let i = hitbox.left; i < hitbox.right; i++) {
            if (i >= hurtbox.left && i <= hurtbox.right) {
                for (let j = hitbox.bottom; j < hitbox.top; j++) {
                    if (j >= hurtbox.bottom && j <= hurtbox.top) {
                        console.log("COLLISION DETECTED AT x:", i, "y:", j);
                        return true;
                    }
                }
            }
        }

        // attacker.hitboxes[i]
        // defender.hurtboxes[i]
    }

    bind(canvas) {
        if (typeof canvas == "string")
            this.canvas = document.getElementById(canvas);
        else
            this.canvas = canvas;

        this.context = this.canvas.getContext("2d");

        this.canvas.addEventListener("keydown", (e) => {
            if (e.keyCode == "32" || e.keyCode == "65" || e.keyCode == "68" || e.keyCode == "83") {
                this.inputsList[e.keyCode] = true;
            }
        });

        this.canvas.addEventListener("keyup", (e) => {
            if (e.keyCode == "32" || e.keyCode == "65" || e.keyCode == "68" || e.keyCode == "83") {
                this.inputsList[e.keyCode] = false;
            }
        });

        this.canvas.focus();
    }

    start() {
        console.log("Starting game.");
        this.player.spawn(0, 0);
        this.animation = setInterval(this.turn.bind(this), this.fps);
        let enemy = new Enemy(this, 100, 150);
        enemy.spawn(this.canvas.width - enemy.width - 100, 0);
    }

    turn() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.processInputs();

        for (let i = 0; i < this.entitiesArray.length; i++) {
            this.entitiesArray[i].render();
        }
    }

    stop() {
        console.log("Stopping game.");
        clearInterval(this.animation);
    }
}