var AnimationHandler = function(that) {


    this.play = function(key, object){
        object.anims.play(key, true);
    };

    this.stop = function(key, object){
        object.anims.play(key, false);
    };

    this.createAnimations = function() {
        //Creating soldier animations
        that.anims.create({
            key: 'left',
            frames: that.anims.generateFrameNumbers('soldier', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        that.anims.create({
            key: 'leftStatic',
            frames: [ { key: 'soldier', frame: 0 } ],
            frameRate: 20
        });

        that.anims.create({
            key: 'turn',
            frames: [ { key: 'soldier', frame: 4 } ],
            frameRate: 20
        });

        that.anims.create({
            key: 'right',
            frames: that.anims.generateFrameNumbers('soldier', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        that.anims.create({
            key: 'rightStatic',
            frames: [ { key: 'soldier', frame: 7 } ],
            frameRate: 20
        });

        //Creating bullet animations  (place holder)
        //...
        //...

    }

    
    


};