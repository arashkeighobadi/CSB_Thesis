module.exports = Checkbox;

function Checkbox(that, text, x, y, action){
    this.gameScene = that;
    this.isChecked = true;
    this.action = action;
    
    this.group = that.add.group();
    
    this.text = that.add.text(x, y, text, { fontSize: '14px', fill: '#FFFFFF' }).setOrigin(0,0.5);
    // this.text.setOrigin(0, 0.5);
    this.group.add(this.text);

    console.log('SO FAR SO GOOD');
    
    this.uncheckedBox = that.add.image(x + this.text.width + 5, y, 'unchecked_box').setScale(0.5);
    //initially the box is checked
    this.uncheckedBox.setAlpha(0);
    this.uncheckedBox.setOrigin(0, 0.5);
    this.uncheckedBox.setInteractive();
    this.uncheckedBox.on('pointerdown', action);
    this.group.add(this.uncheckedBox);

    this.checkedBox = that.add.image(x + this.text.width + 5, y, 'checked_box').setScale(0.5);
    this.checkedBox.setOrigin(0, 0.5);
    this.checkedBox.setInteractive();
    this.checkedBox.on('pointerdown', action);
    this.group.add(this.checkedBox);

    this.setLocation(x, y);
}

Checkbox.prototype.setLocation = function(x, y){
    this.group.x = x;
    this.group.y = y;

    

    // this.checkedBox.x = this.text.width + 5;
    // this.checkedBox.y = y;

    // this.uncheckedBox.x = this.text.width + 5;
    // this.uncheckedBox.y = y;
}

// Checkbox.prototype.checkboxClicked = function(action){
//     if(this.isChecked){
//         //uncheck it
//         this.uncheck(action);
//         this.isChecked = false;
//     }
//     else {
//         //check it
//         this.check(action);
//         this.isChecked = true;
//     }
// }

Checkbox.prototype.check = function(){
    this.uncheckedBox.setAlpha(0);
    this.checkedBox.setAlpha(1);
    this.isChecked = true;
}

Checkbox.prototype.uncheck = function(){
    this.checkedBox.setAlpha(0);
    this.uncheckedBox.setAlpha(1);
    this.isChecked = false;
}