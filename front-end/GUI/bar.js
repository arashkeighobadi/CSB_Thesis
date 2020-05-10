module.exports = Bar;

function Bar(that, x, y, totalPoints){
    this.bar = that.add.image(x, y, "bar");
	this.bar.setOrigin(0,0.5);
    this.bar.displayHeight  = 14;
    
    this.INSERTABLE_WIDTH = 48; //pixels
    
    this.barPoints = [];
    let insertPointPosX = x + 16;
    for(let i = 0; i < totalPoints; i++){
        let point = that.add.image(insertPointPosX, y, "point");
        console.log("point width: " + point.width);
        let pointWidth = (point.width*totalPoints)/(this.INSERTABLE_WIDTH/point.width);
		point.setOrigin(0,0.5);
		point.displayHeight  = 7.5;
		point.displayWidth  = pointWidth;
		
		this.barPoints.unshift(point);
		insertPointPosX += pointWidth;
	}
}

Bar.prototype.removePoints = function(number){
	for(let i = 0; i < number; i++){
		this.barPoints.shift().destroy();
	}
}



