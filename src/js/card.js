function makeBox(x,y, color) {
    var bmd = this.game.add.bitmapData(x, y);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, x, y);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    return bmd;
}

var Card = function(game, x, y, image, frame) {
  this.game = game;
  this.index = frame;
  this.facing = 'back';

  Phaser.Group.call(this, game);

  this.flipSnd = this.game.add.sound('flip');
  this.flipSnd.volume = 0.3;

  this.face = this.create(x, y, image, frame);
  this.face.scale.x = 0;
  this.face.inputEnabled = true;
  this.face.anchor.set(0.5);

  this.back = this.create(x, y, makeBox(145, 145, 'blue'));
  this.back.anchor.set(0.5);
  this.back.inputEnabled = true;
  this.back.events.onInputDown.add(this.show, this);

};

Card.prototype = Object.create(Phaser.Group.prototype);
Card.prototype.show = function() {
  this.flipSnd.play();
  this.facing = 'face';
  var hide_back = this.game.add.tween(this.back.scale).to({x: 0}, 100);
  var show_face = this.game.add.tween(this.face.scale).to({x: 1}, 100);
  hide_back.chain(show_face);
  hide_back.start();

};
Card.prototype.hide = function() {

  this.flipSnd.play();
  this.facing = 'back';
  var show_back = this.game.add.tween(this.back.scale).to({x: 1}, 100);
  var hide_face = this.game.add.tween(this.face.scale).to({x: 0}, 100);
  hide_face.chain(show_back);
  hide_face.start();
};

Card.prototype.constructor = Card;
