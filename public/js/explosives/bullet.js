export class Bullet extends Explosive {
    constructor(that, x, y, name, owner){
        super(that, x, y, name);
        this.bodySprite.setSize(4,4);
        this.owner = owner;
        this.bodySprite.owner = owner;
        this.speed = 500;
        that.bullets.add(this.bodySprite);
        // this.index = this.playGameScene.bulletList.length;
        // that.bulletList[this.index] = this;
        // this.bodySprite.setTint(0xffff00);
        
        this.enableBody();
        this.setCollideWorldBound(true);
        //NOTE: #1, #2, #3 work together
        this.bodySprite.body.onWorldBounds = true;//#1
    }
   

    //what to do when bullets collide the world bounds...
    onWorldBounds (bullet)//#3
    {
        //NOTE: I'm not sure about this deallocation of the bullet.
        //      Must go through this topic in depth to make sure all the
        //      memory relevant to this bullet is freed after collision
        //      because by nature there's going to be a lot of bullets in the game.

        // console.log(bullet);
        // console.log(bullet.playGameScene.bulletList[bullet.index]);
        // console.log("triggered!");
        // bullet.setVelocity(0,0);
        console.log("bullet index : " + bullet.index);
        console.log(bullet.playGameScene.bulletList);
        // bullet.playGameScene.bulletList[bullet.index].bodySprite.destroy();
        // delete bullet.playGameScene.bulletList[bullet.index];
        // console.log(bullet);
        // console.log(bullet.playGameScene.bulletList[bullet.index]);
    }
}

import { Explosive } from './explosive.js';