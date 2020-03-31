export class Character {
    constructor(that, charInfo) {
        this.playGameScene = that;
        this.speed = 50;
        this.spriteAngle = charInfo.spriteAngle;
        this.bodySprite;
        this.charContainer = that.add.container(charInfo.x, charInfo.y).setSize(13, 13);
        this.charContainer.charID = charInfo.charID;//change playerId to charID in charInfo objects everywhere
        that.physics.world.enable(this.charContainer);
        this.charContainer.body.setCollideWorldBounds(true);

    }

}