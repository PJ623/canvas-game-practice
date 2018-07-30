
class Action {
    constructor(startup, active, recovery) {
        this.startup = startup;
        this.active = active;
        this.recovery = recovery;
        this.animationDuration = this.startup.duration + this.active.duration + this.recovery.duration;
        this.currentFrame = 0;
        this.isDone = false;
    }

    // get callbacks! hmm make objects for startup, active, and recovery?
    execute() {
        if (this.currentFrame < this.startup.duration) {
            if (typeof this.startup.effect == "function") {
                this.startup.effect(this.currentFrame);
            }
        } else if ((this.currentFrame - this.startup.duration) < this.active.duration) {
            if (typeof this.active.effect == "function") {
                this.active.effect(this.currentFrame);
            }
        } else if ((this.currentFrame - this.startup.duration - this.active.duration) < this.recovery.duration) {
            if (typeof this.recovery.effect == "function") {
                this.recovery.effect(this.currentFrame);
            }
        }
        if (this.currentFrame == this.animationDuration) {
            console.log("returning false");
            this.isDone = true;
        }

        this.currentFrame++;
    }
}

class Effect {
    // effect is callback
    constructor(/*executor,*/ duration, effect) {
        //this.executor = executor;
        this.duration = duration;
        this.effect = effect;
    }

    /*
    getThis(){
        console.log(this);
    }*/
}