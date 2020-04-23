module.exports = Collectable;

function Collectable(that, x, y, name){
  this.playGameScene = that;
  this.ownerTeam = null;
  this.bodySprite = that.add.sprite(x, y, name);
  this.bodySprite.ownerTeam = this.ownerTeam;
}
      
Collectable.prototype.enableBody = function(){
  this.playGameScene.physics.world.enableBody(this.bodySprite);
  this.bodySprite.body.moves = false;
}

Collectable.prototype.setOwnerTeam = function(team){
  this.ownerTeam = team;
  this.bodySprite.ownerTeam = this.ownerTeam;
}