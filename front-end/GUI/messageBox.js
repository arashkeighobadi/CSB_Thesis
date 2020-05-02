module.exports = MessageBox;

function MessageBox(that, text, w = 400, h = 250){
    this.gameScene = that;
    
    //make a group to hold all the elements
    this.msgBox = this.gameScene.add.group();
    
    this.back = this.gameScene.add.image(400, 300, 'window_small');

    //make a text field
    this.text1 = this.gameScene.add.text(0, 0, text, { fontSize: '32px', fill: '#FFFFFF' });

    //set the textfeild to wrap if the text is too long
    this.text1.wordWrap = true;
    
    //add the elements to the group
    this.msgBox.add(this.back);
    this.msgBox.add(this.text1);
    
    //set the message box in the center of the screen
    this.msgBox.x = 400;
    this.msgBox.y = 300;

    //set the text in the middle of the message box
    this.text1.x = 250 /* - this.text1.width/2 */;
    this.text1.y = 200 + this.text1.height / 2;
    //make a state reference to the messsage box
    // this.msgBox = msgBox;
}

MessageBox.prototype.addButton = function(buttonText, buttonLogic) {
    //make the close button
    // this.button = this.gameScene.add.button(0, 0, buttonText);
    this.button = this.gameScene.add.text(400, 300, buttonText, { fontSize: '32px', fill: '#0f0' });
    this.button.setInteractive();
    this.button.on('pointerdown', buttonLogic);


    //add the button to the group
    this.msgBox.add(this.button);
    //set the close button
    //in the center horizontally
    //and near the bottom of the box vertically
    this.button.x = 400 - this.button.width/2;//this.back.width / 2 - this.button.width / 2;
    this.button.y = 300 - this.button.height/2;//this.back.height - this.button.height;
    //enable the button for input
    // this.button.inputEnabled = true;
    //add a listener to destroy the box when the button is pressed
    // this.button.events.onInputDown.add(this.hideBox, this);
}

MessageBox.prototype.hideBox = function() {
    //destroy the box when the button is pressed
    this.msgBox.getChildren().forEach(element => {
        element.destroy();
    });
    // this.msgBox.destroy();
    this.text1.destroy();
}
