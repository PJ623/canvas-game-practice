class Entity {
    constructor(game, width, height, appearance) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.appearance = appearance;
        this.positionX;
        this.positionY;
        this.id;
    }

    spawn(x, y) {
        this.positionX = x;
        this.positionY = y;
        this.game.entitiesArray.push(this);
        this.id = this.game.entitiesArray.length - 1;

        this.move(0, 0);
    }

    render() {
        this.game.context.beginPath();
        this.game.context.fillStyle = this.appearance;
        this.game.context.fillRect(this.positionX, this.game.adjustForFloor(this.positionY, this.height), this.width, this.height);
    }

    get positionOfPoints() {
        let left = this.positionX;
        let right = this.positionX + this.width;
        let top = this.positionY + this.height;
        let bottom = this.positionY;

        return { left: left, right: right, top: top, bottom: bottom };
    }
}