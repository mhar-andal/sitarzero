/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Datetime from 'datetime'

export default class Game extends Phaser.State {
  init () {
    var $that = this
    this.notes = [];
    //json parsing
    var manifestNote = $.getJSON('./assets/images/test-json-formatted.json', function(data){}).done(function(data){
      data.score.part.measure.map(function(obj, index){
    		if(index == 0) {
    			$that.notes.push(obj.attributes.divisions)
    		}
    		$that.notes.push(obj)
    	})
    });
    this.score = 0;
   }

  preload () {
    this.load.image('ground', 'assets/images/board.png');
  	this.load.image('blankred', 'assets/images/blankred.png')
  	this.load.image('blankyellow', 'assets/images/blankyellow.png')
  	this.load.image('solidred', 'assets/images/solidred.png')
  	this.load.image('solidyellow', 'assets/images/solidyellow.png')
  	this.load.image('rednote', 'assets/images/rednote.png')
  	this.load.image('yellownote', 'assets/images/yellownote.png')
  	this.cursors = game.input.keyboard.createCursorKeys();
    this.load.audio('song', 'assets/creforge.exe.wav')
  }

  create () {
    // this.music = this.add.audio('song')
    // this.music.play();
    this.totalDuration = (parseInt(this.notes[0]) * this.notes.length-1) * 4;
    this.time = 44.5;
    this.tempo = (4 * (this.notes.length-1)) / this.time;
    this.onesec = this.tempo * parseInt(this.notes[0])
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 100;
    this.background = this.add.sprite(0, 0, 'ground');
  	this.slot1 = this.add.sprite(495, 890, 'blankred')
  	this.slot3 = this.add.sprite(940, 890, 'blankred')
  	this.slot2 = this.add.sprite(720, 890, 'blankyellow')
  	this.slot4 = this.add.sprite(1160, 890, 'blankyellow')
    this.slot1.scale.setTo(0.7,0.7);
    this.slot2.scale.setTo(0.7,0.7);
    this.slot3.scale.setTo(0.7,0.7);
    this.slot4.scale.setTo(0.7,0.7);
    this.solid1 = game.add.sprite(495, 890, 'solidred');
    this.solid1.scale.setTo(0.7,0.7);
    this.solid2 = game.add.sprite(720, 890, 'solidyellow');
    this.solid2.scale.setTo(0.7,0.7);
    this.solid3 = game.add.sprite(940, 890, 'solidred');
    this.solid3.scale.setTo(0.7,0.7);
    this.solid4 = game.add.sprite(1160, 890, 'solidyellow');
    this.solid4.scale.setTo(0.7,0.7);

    this.scoreText = 'Score: ' + this.score;
    this.scoreBox = this.add.text(1500, 50, this.scoreText)
    this.scoreBox.fontSize = 40;
    this.scoreBox.fill = 'white'

    // this.note = game.add.sprite(495,900,'rednote');
    this.note = game.add.sprite(495,-200,'rednote')
    this.note.scale.setTo(0.7,0.7);
    this.note.hit = false;
    game.physics.enable(this.note, Phaser.Physics.ARCADE);
    console.log(this.scoreBox)
    console.log(this.note)
  }

  noteHit () {
    this.score = this.score + 50;
    this.scoreText = 'Score: ' + this.score;
    console.log(this.scoreText)
    this.scoreBox.text = this.scoreText;
  }

  noteMiss () {
    this.score = this.score - 20;
    this.scoreText = 'Score: ' + this.score;
    console.log(this.scoreText)
    this.scoreBox.text = this.scoreText;
  }

  checkNote (note) {
    // if(note.y > 1000) {
    //   note.destroy();
    //   noteMiss();
    // }

    if(note.hit == false) {
      if(note.y > 850 && note.y < 900) {
        this.noteHit();
        note.hit = true
      } else {
        note.hit = true
        note.destroy();
        this.noteMiss();
      }
    }
  }

  render () {
    if(this.cursors.left.isDown) {
      this.solid1.visible = true;
      this.checkNote(this.note)
    } else if(this.cursors.up.isDown) {
      this.solid2.visible = true;
    } else if(this.cursors.down.isDown) {
      this.solid3.visible = true;
    } else if(this.cursors.right.isDown) {
      this.solid4.visible = true;
    } else {
      this.allOf();
    }
  }

  allOf() {
    this.solid1.visible = false;
    this.solid2.visible = false;
    this.solid3.visible = false;
    this.solid4.visible = false;
  }

  destroySprite (sprite) {
    sprite.destroy();
  }
}
