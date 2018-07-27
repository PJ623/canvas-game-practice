
class Player {
    constructor(width, height, appearance) {
        this.width = width;
        this.height = height;
        this.appearance = appearance;
        this.state = "neutral";
        this.action = null;
    }

    checkState() {
        //console.log("this.action:",this.action);
        //console.log("state:", this.state);
        if (this.action) {
            //console.log("this.action:", this.action);
            if (this.action.isDone) {
                //console.log("Player.action was:", this.action);
                this.state = "neutral";
                this.action = null;
                //console.log("Player.action is now:", this.action);
            } else {
                this.action.execute();
            }
        } else {
            //console.log("Player.action is false.");
        }
    }

    // Make hitboxes
    attack() {
        let startup = new Effect(/*this,*/ 5, () => {
            console.log("startup frames");
            // alter hurtbox?
        });

        let active = new Effect(/*this,*/ 3, () => {
            console.log("active frames");
            // form hitbox
        });

        let recovery = new Effect(/*this,*/ 8, () => {
            //this.state = "recovering";
            //console.log(this.state);
            console.log("recovery frames");
            // remove hitbox
        });

        if (this.state == "neutral") {
            console.log("Launching attack!");
            this.state = "attacking";
            this.action = new Action(startup, active, recovery);
        }
    }

    render(){

    }

    get area(){

    }
}