var LoginForm = function(that) {
    // that.add.image(400, 300, 'pic');

    var text = that.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});

    var element = that.add.dom(400, 600).createFromCache('nameform');

    element.setPerspective(800);

    element.addListener('click');

    element.on('click', function (event) {

        if (event.target.name === 'loginButton')
        {
            var inputUsername = this.getChildByName('username');
            var inputPassword = this.getChildByName('password');
            var self = this;

            //  Have they entered anything?
            if (inputUsername.value !== '' && inputPassword.value !== '')
            {
                that.socket.emit('loginPressed', {username: inputUsername.value, password: inputPassword.value});
                that.socket.on('loginApproved',
                    function(loginInfo) {
                        // console.log("Login approved.");
                        that.player1.username = loginInfo;
                        console.log("login approved. username: ", that.player1.username);
                        
                        //  Turn off the click events
                        this.removeListener('click');

                        //  Tween the login form out
                        self.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });

                        self.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 3000, ease: 'Power3',
                            onComplete: function ()
                            {
                                element.setVisible(false);
                            }
                        });

                        //  Populate the text with whatever they typed in as the username!
                        text.setText(inputUsername.value + "'s score: ");
                    }
                );
                that.socket.on('loginFailed',
                    function(loginInfo) {
                        console.log("loginFailed!");
                    }
                );
                
            }
            else
            {
                //  Flash the prompt
                this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
            }
        }

    });

    that.tweens.add({
        targets: element,
        y: 300,
        duration: 3000,
        ease: 'Power3'
    });

};