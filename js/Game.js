//game initialize
var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//json parsing
function Note(data) {
	this.duration = data.duration;
	this.type = data.type;
	this.pitch = data.pitch;
}
var notes = [];
var division;
var manifestNote = $.getJSON('./assets/test-json-formatted.json', function(data) {}).done(function(data){
	console.log(data)
	data.score.part.measure.map(function(obj, index){
		if(index == 0) {
			notes.push(obj.attributes.divisions)
		}
		notes.push(obj)
		// obj.note.map(function(obj2){
		// 	notes.push(new Note(obj2))
		// })
	})
});

console.log(notes)
//game logic

function preload() {
	game.load.image('ground', 'assets/board.png');
	game.load.image('blankred', 'assets/blankred.png')
	game.load.image('blankyellow', 'assets/blankyellow.png')
	game.load.image('solidred', 'assets/solidred.png')
	game.load.image('solidyellow', 'assets/solidyellow.png')
	cursors = game.input.keyboard.createCursorKeys();

}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'ground');
	game.add.sprite(495, 890, 'blankred').scale.setTo(0.7,0.7);
	game.add.sprite(940, 890, 'blankred').scale.setTo(0.7,0.7);
	game.add.sprite(720, 890, 'blankyellow').scale.setTo(0.7,0.7);
	game.add.sprite(1160, 890, 'blankyellow').scale.setTo(0.7,0.7);
}

function update() {
	if(cursors.left.isDown) {
		var solid = game.add.sprite(495, 890, 'solidred').scale.setTo(0.7,0.7);
		if(cursors.left.isUp) {
			console.log('fuck')
		}
	}
}
