export class Character {
    constructor(that, charInfo) {
        this.playGameScene = that;
        this.charID = charInfo.charID;
        this.team = charInfo.team;
        this.speed = 50;
        this.spriteAngle = charInfo.spriteAngle;
        this.bodySprite;
        this.charContainer = that.add.container(charInfo.x, charInfo.y).setSize(13, 13);
        this.charContainer.charID = this.charID;//change playerId to charID in charInfo objects everywhere
        this.charContainer.team = this.team;
        that.physics.world.enable(this.charContainer);
        this.charContainer.body.setCollideWorldBounds(true);

    }

}