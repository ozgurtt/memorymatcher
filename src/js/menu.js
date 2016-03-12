/*global Game*/
/*global Game*/

Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {
    //Generate Level with Cellular Automata
    
    this.game.stage.backgroundColor = '#dcdcdc';
   
    this.titleText = this.game.add.bitmapText(Game.w/2, Game.h/2-100, 'minecraftia', "MEMORY\nMATCHER", 64 );
    this.titleText.anchor.setTo(0.5);
    this.titleText.tint = 0x0000ff;

    this.game.add.tween(this.titleText)
      .to( {y:300 }, 1000, Phaser.Easing.Linear.In, true, 0, -1)
      .yoyo(true);


    // var music_by = this.game.add.bitmapText(Game.w/2, Game.h-10, 'minecraftia', 'Music: Put Yourself In My Place (PSG Version) by Snabish', 18);
    // music_by.anchor.setTo(0.5);
    // music_by.inputEnabled = true;
    // music_by.events.onInputDown.add(function() {
    //   window.open("http://opengameart.org/content/put-yourself-in-my-place-psg-version");
    // },this);
    // music_by.events.onInputOver.add(function() {
    //   music_by.tint = 0xffff00;
    // },this);
    // music_by.events.onInputOut.add(function() {
    //   music_by.tint = 0xffffff;
    // },this);

        // Start Message

        var clickText = this.game.add.bitmapText(Game.w/2, Game.h/2+50, 'minecraftia', '~click to start~', 24).anchor.setTo(0.5); 

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }
    }
};


