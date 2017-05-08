 var socket;

var pressed = false;

var pos;

var center;
var num = 1;
var inkArray = [];
var maxSize = [];
var prev;
var a, w;
var squareArray = [];
var prev = 0;


var paths = [];
var painting = false;
var next = 0;
var current;
var previous;


function setup() {

	createCanvas(windowWidth, windowHeight);
	current = createVector(0,0);
  	previous = createVector(0,0);



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

// function draw() {
  // background(255)
  // if (pressed) {
  // 	fill(255, 0, 0);
  // }
  // ellipse(pos.x, 0, 50, 50);

//DRIP
// for (var i = 0; i <num; i++){
// 	prev.x = inkArray[i].x;
//     prev.y = inkArray[i].y;
//     inkArray[i].x += random(-0.5, 0.5);
//     inkArray[i].y += random(3);
//     w = abs(maxSize[i] / (inkArray[i].y + 25));
//     a = map(inkArray[i].y, maxSize[i], 0, 0, 200);
//     strokeWeight(w);
//     stroke(0, a);
//     if (inkArray[i].y < maxSize[i]) {
//       line(prev.x, prev.y, inkArray[i].x, inkArray[i].y);
//     } else {
//       // inkArray[i] = createVector(random(-width / 2,width / 2) + center.x, 0); 
//       // maxSize[i] = random(height);
//     }
// }


//SQUARES
// 	


//CIRCLES

function draw() {
  background(200);
  
  // If it's time for a new point
  if (millis() > next && painting) {

    // Grab mouse position      
    current.x = mouseX;
    current.y = mouseY;

    // New particle's force is based on mouse movement
    var force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // Add new particle
    paths[paths.length - 1].add(current, force);
    
    // Schedule next circle
    next = millis() + random(100);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for( var i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

// Start it up
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
}

// Stop
function mouseReleased() {
  painting = false;
}

// A Path is a list of particles
function Path() {
  this.particles = [];
  this.hue = random(100);
}

Path.prototype.add = function(position, force) {
  // Add a new particle with a position, force, and hue
  this.particles.push(new Particle(position, force, this.hue));
}

// Display plath
Path.prototype.update = function() {  
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  }
}  

// Display plath
Path.prototype.display = function() {
  
  // Loop through backwards
  for (var i = this.particles.length - 1; i >= 0; i--) {
    // If we shold remove it
    if (this.particles[i].lifespan <= 0) {
      this.particles.splice(i, 1);
    // Otherwise, display it
    } else {
      this.particles[i].display(this.particles[i+1]);
    }
  }

}  

// Particles along the path
function Particle(position, force, hue) {
  this.position = createVector(position.x, position.y);
  this.velocity = createVector(force.x, force.y);
  this.drag = 0.95;
  this.lifespan = 255;
}

Particle.prototype.update = function() {
  // Move it
  this.position.add(this.velocity);
  // Slow it down
  this.velocity.mult(this.drag);
  // Fade it out
  this.lifespan--;
}

// Draw particle and connect it with a line
// Draw a line to another
Particle.prototype.display = function(other) {
  stroke(0, this.lifespan);
  fill(0, this.lifespan/2);    
  ellipse(this.position.x,this.position.y, 8, 8);    
  // If we need to draw a line
  if (other) {
    line(this.position.x, this.position.y, other.position.x, other.position.y);
  }
}