 var socket;

 $(window).bind(
 	"touchmove",
 	function(e) {
 		e.preventDefault(); 
	 }
 );

// socket.on('messages', function(data) {
//     alert(data);
// });

function setup() {
	socket = io.connect('http://10.209.25.128:3000');

	socket.on('connect', function(data) {
		socket.emit('drip:phone', 'Hi I\'m a phone');
	});

	createCanvas(windowWidth, windowHeight);

}

function draw() {
  background(255)
  ellipse(mouseX, mouseY, 50, 50)
}

function mousePressed() {
	console.log('touched');
	socket.emit('pressed', true);
}

function windowResized(){
 resizeCanvas(windowWidth, windowHeight)
}

function mouseReleased() {
	var data = {
		x:mouseX / width,
		y:mouseY / height
	}
	socket.emit("paint",data)
}

function mouseDragged(){
	var data = {
		x:mouseX / width,
		y:mouseY / height
	}
	socket.emit("mouse",data)

}