 var socket;

var pressed = false;

var pos;

var center;
var num = 1;
var inkArray = [];
var maxSize = [];
var prev;
var a, w;


function setup() {

	createCanvas(windowWidth, windowHeight);

	center = createVector(width/2, height/2);
	for (var i = 0; i <num; i++){
		inkArray[i] = createVector(random(-width / 2,width / 2) + center.x, 0);
		maxSize[i] = random(height);
	}

	pos = createVector( width / 2, height / 2 );
	prev = createVector(0,0);

	socket = io.connect('http://localhost:3000');

	socket.on('connect', function(data) {
		socket.emit('drip:canvas', 'Hi I\'m a canvas!');
	});

	socket.on('pressed', function(data) {
		pressed = true;
	});

	socket.on('paint', function(data) {
		pos.x = data.x * width;

		num += 1;
		inkArray[num - 1] = createVector(data.x * width, 0);
		maxSize[num - 1] = random(height);
	})

	socket.on('mouse', function(data) {
		pos.x = data.x * width;
		pos.y = data.y * height;
	});
}

function draw() {
  // background(255)
  // if (pressed) {
  // 	fill(255, 0, 0);
  // }
  // ellipse(pos.x, 0, 50, 50);


for (var i = 0; i <num; i++){
	prev.x = inkArray[i].x;
    prev.y = inkArray[i].y;
    inkArray[i].x += random(-0.5, 0.5);
    inkArray[i].y += random(3);
    w = abs(maxSize[i] / (inkArray[i].y + 25));
    a = map(inkArray[i].y, maxSize[i], 0, 0, 200);
    strokeWeight(w);
    stroke(0, a);
    if (inkArray[i].y < maxSize[i]) {
      line(prev.x, prev.y, inkArray[i].x, inkArray[i].y);
    } else {
      // inkArray[i] = createVector(random(-width / 2,width / 2) + center.x, 0); 
      // maxSize[i] = random(height);
    }
}

}

function windowResized(){
 resizeCanvas(windowWidth, windowHeight)
}