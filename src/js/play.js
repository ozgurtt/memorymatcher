/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var fails = 0;
var score = 0
var cards;
var gameOver = false;


Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);


    if (difficulty === 'easy') {
      pairs = 6;
      card_cols = 4;
    }else if (difficulty === 'normal') {
      pairs = 8;
      card_cols = 4;
    }else if (difficulty === 'hard') {
      pairs = 10;
      card_cols = 5;
    }


    this.matchSnd = this.game.add.sound('match');
    this.matchSnd.volume = 0.3;

    this.applauseSnd = this.game.add.sound('applause');
    this.applauseSnd.volume = 0.3;

    this.shuffleSnd = this.game.add.sound('shuffle');
    this.shuffleSnd.volume = 0.3;
    this.shuffleSnd.play();

    this.startTime = this.game.time.time;

    var starter_deck = [];
    var drawn_deck = [];
    var shuffled_deck = [];

    for(var i = 0; i < 10;i++) {
      starter_deck.push(i);
    }

    for(var i=0;i< pairs;i++) {
      var randomCard = Phaser.ArrayUtils.removeRandomItem(starter_deck);
      drawn_deck.push(randomCard);
      drawn_deck.push(randomCard);
    }

    shuffled_deck = this.shuffle(drawn_deck);

    cards = this.game.add.group();

    // pairs = 8; 
    // card_cols = 4;

    //5 to 10 pairs
    var margin = (Game.w-(160*(card_cols-1)))/2; //half sprite size + space size minus the gap after the last piece

    for (var i = 0;i < pairs*2;i++) {
      var x = (i%card_cols) * 150 + margin;
      var y = Math.floor(i/card_cols)*150 + 150;
      var card = new Card(this.game, 0, 0, 'animals', shuffled_deck[i]);
      this.game.add.tween(card).to({x: x, y: y}, 300).start()

      card.back.events.onInputUp.add(this.check, this);
      cards.add(card)

    }
    // cards.x = Game.w/2 - cards.width;
    // cards.y = Game.h/2 - cards.height;

    this.failsText = this.game.add.bitmapText(Game.w-200, 10, 'minecraftia', 'Fails: ' + fails, 24);
    this.runningTimeText = this.game.add.bitmapText(20, 20, 'minecraftia','00:00',32);
    this.playAgainText = this.game.add.bitmapText(Game.w + 100, this.game.world.centerY, 'minecraftia','test',48);

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },
  check: function() {
    var upcards = [];
    cards.forEach(function(card) {
      if (card.facing === 'face') {
        upcards.push(card);
      }
    },this);
    if (upcards.length === 2) {
      if (upcards[0].index === upcards[1].index) {
        this.matchSnd.play();
        score += 1;
        this.game.add.tween(upcards[0].face.scale).to({x: 0, y: 0}, 100).start();
        this.game.add.tween(upcards[1].face.scale).to({x: 0, y: 0}, 100).start();

        this.game.time.events.add(Phaser.Timer.SECOND*0.5, function() { 
          upcards[0].destroy();
          upcards[1].destroy();
        }, this);

      }else {
        this.game.time.events.add(Phaser.Timer.SECOND*0.5, function() { 
          fails += 1;
          upcards[0].hide();
          upcards[1].hide();
        }, this);
      }
    }else if (upcards.length > 2) {
      for(var i = 0;i < upcards.length;i++) {
        fails += 1;
        upcards[i].hide();
      }

    }

    if (score >= pairs) {
      gameOver = true;
    }

  },
  shuffle:  function(deck){
    var tmp_deck = deck.slice();

    var result = []; 
    while (tmp_deck.length > 0) {  
      var index = Math.floor(Math.random() * tmp_deck.length);
      result.push(tmp_deck.splice(index, 1)[0]);
    }
    return result;
  },
  updateRunningTime: function() {
   
    this.runningTime = this.game.time.time - this.startTime;
    
    minutes = Math.floor(this.runningTime / 60000) % 60; 
    seconds = Math.floor(this.runningTime / 1000) % 60;
    milliseconds = Math.floor(this.runningTime) % 100;

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    if (milliseconds < 10) {
      milliseconds = '0' + milliseconds;
    }

    if (minutes != '00') {
      this.runningTimeText.setText(minutes+':'+seconds+':'+milliseconds);
    }else {
      this.runningTimeText.setText(seconds+':'+milliseconds);
    }

 },

  update: function() {
    if (gameOver === false) { 
      this.updateRunningTime();
      this.failsText.setText('Fails: '+ fails);
    }else {
      this.applauseSnd.play();
      this.playAgainText.setText('Play Again?');
      this.game.time.events.add(Phaser.Timer.SECOND*0.5, function() { 
      this.game.add.tween(this.playAgainText).to({x: this.game.world.centerX-300}, 300, Phaser.Easing.Linear.None).start();
            this.twitterButton.visible = true;
       }, this);
          
      if (this.game.input.activePointer.isDown){
        this.applauseSnd.stop();
        gameOver = false;
        fails = 0;
        score = 0;
        this.game.state.start('Menu');
      }
    }

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/memorymatcher/'; 
    var twitter_name = 'rantt_';
    var tags = [''];

    window.open('http://twitter.com/share?text=I+beat+Memory+Matcher+in+'+this.runningTimeText.text+'+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};
