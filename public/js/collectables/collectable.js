export class Collectable {
    constructor(that, x, y, name) {
        this.playGameScene = that;
        this.ownerTeam = null;
        this.bodySprite = that.add.sprite(x, y, name);
        this.bodySprite.ownerTeam = this.ownerTeam;
      }
      
      enableBody(){
        this.playGameScene.physics.world.enableBody(this.bodySprite);
        this.bodySprite.body.moves = false;
      }
      
      setOwnerTeam(team){
        this.ownerTeam = team;
        this.bodySprite.ownerTeam = this.ownerTeam;
    }

    
}

