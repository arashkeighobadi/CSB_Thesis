export class Explosive {
    constructor(that, x, y, name) {
        this.playGameScene = that;
        this.ownerTeam = null;
        this.owner = null;
        this.bodySprite = that.physics.add.image(x, y, name);
        this.bodySprite.owner = this.owner;
        this.bodySprite.ownerTeam = this.ownerTeam;
    }

    enableBody(){
        this.playGameScene.physics.world.enableBody(this.bodySprite);
    }

    setCollideWorldBound(bool){
        if(bool && !this.bodySprite.body){
            this.enableBody();
            this.bodySprite.body.setCollideWorldBounds(bool);
        }
        else if (!bool && !this.bodySprite.body){
            console.log("Error: you can use setCollideWorldBound(false) only if the body has been enabled before!");
        }
        else {
            this.bodySprite.body.setCollideWorldBounds(bool);
        }
    }
    
    setVelocity(xVelocity, yVelocity){
        this.bodySprite.body.setVelocity(xVelocity, yVelocity);
    }
}