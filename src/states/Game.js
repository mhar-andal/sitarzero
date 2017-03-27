/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import score from './Score.js'

export default class Game extends Phaser.State {
  init () {
    var $that = this;
    this.notes = score;

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
    this.load.image('button', 'assets/images/play.png')
  }

  create () {
    this.queue = [];
    this.count = 0;
    this.goalTime = 0;
    this.currentNote = 0
    console.log(this.notes)
    this.music = this.add.audio('song')
    this.totalDuration = 927360;
    this.time = 44.5;
    this.dursec = this.totalDuration / this.time;
    this.timePerMeasure = 40320 / this.dursec
    this.tempo = (4 * (this.notes.length-1)) / this.time;
    this.onesec = this.tempo * parseInt(this.notes[0])
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 200;
    this.background = this.add.sprite(0, 0, 'ground');
  	this.slot1 = this.add.sprite(495, 890, 'blankred');
  	this.slot3 = this.add.sprite(940, 890, 'blankred');
  	this.slot2 = this.add.sprite(720, 890, 'blankyellow');
  	this.slot4 = this.add.sprite(1160, 890, 'blankyellow');
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

    this.button = this.add.button(1500, 200, 'button', this.actionOnClick, this, 2, 1, 0);

    this.scoreText = 'Score: ' + this.score;
    this.scoreBox = this.add.text(1500, 50, this.scoreText)
    this.scoreBox.fontSize = 40;
    this.scoreBox.fill = 'white'

    this.iter = 1;


    // this.note = game.add.sprite(495,900,'rednote');
    // this.note = game.add.sprite(495,-200,'rednote')
    // this.note.scale.setTo(0.7,0.7);
    // this.note.hit = false;
    // game.physics.enable(this.note, Phaser.Physics.ARCADE);
    // console.log(this.scoreBox)
    // console.log(this.note)
  }

  noteHit () {
    this.score = this.score + 50;
    this.scoreText = 'Score: ' + this.score;
    console.log(this.scoreText)
    this.scoreBox.text = this.scoreText;
    this.count = this.count + 1;
  }

  noteMiss () {
    this.score = this.score - 20;
    this.scoreText = 'Score: ' + this.score;
    console.log(this.scoreText)
    this.scoreBox.text = this.scoreText;
    this.count = this.count + 1;
  }

  actionOnClick () {
    this.music.play();
    this.timeNow = new Date();
    this.button.destroy();
  }

  checkNote (note) {
    // if(note.y > 1000) {
    //   note.destroy();
    //   noteMiss();
    // }

    if(note.hit == false) {
      if(note.y > 850 && note.y < 900) {
        this.noteHit();
        note.hit = true;
      } else {
        note.hit = true;
        note.destroy();
        this.noteMiss();
      }
    }
  }

  genNote (passNote) {
    var note = game.add.sprite(this.determineCol(passNote.pitch.step),-200,'rednote')
    note.hit = false;
    note.scale.setTo(0.7,0.7)
    game.physics.enable(note, Phaser.Physics.ARCADE);
    this.queue.push(note)
  }

  determineCol (step) {
    switch(step) {
      case 'A':
        return 495;
        break;
      case 'B':
        return 720;
        break;
      case 'C':
        return 940;
        break;
      case 'D':
        return 1160;
        break;
      case 'E':
      return 495;
        break;
      case 'F':
      return 720;
        break;
      case 'G':
      return 940;
        break;
    }
  }

  //its gonna see the diff between the date it recieves and the date that the song started,
  // find what measure it will be on and play notes for that measure
  makeNotes () {
    var curTime = new Date();
    var time = (curTime - this.timeNow) / 5000
    if(time > this.goalTime) {
      //var curMeasure = this.goalTime == 0 ? parseInt(this.goalTime/this.timePerMeasure) + 1: (this.goalTime/this.timePerMeasure).floor + 1
      var curNote = this.notes[0]['score']['part']['measure'][parseInt(this.iter)]['note'][this.currentNote];
      this.currentNote += 1;
      this.goalTime = this.goalTime + (parseInt(curNote.duration)/this.dursec)
      this.genNote(curNote)
      this.iter += .25;
    }
  }

  render () {
    this.makeNotes()

    if(this.cursors.left.isDown) {
      this.solid1.visible = true;
      this.checkNote(this.queue[this.count])
    } else if(this.cursors.up.isDown) {
      this.solid2.visible = true;
      this.checkNote(this.queue[this.count])
    } else if(this.cursors.down.isDown) {
      this.solid3.visible = true;
      this.checkNote(this.queue[this.count])
    } else if(this.cursors.right.isDown) {
      this.solid4.visible = true;
      this.checkNote(this.queue[this.count])
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
