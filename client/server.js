var express = require('express')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router();

var server = require("http").createServer(app)
var io = require("socket.io")(server)

app.start = app.list = function() {
	return server.listen.apply(server, arguments);
}

app.get(express.static(__dirname + "/node_modules"))

app.use(express.static(__dirname + '/views')); // set the static files location for the static html
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser());                      // pull information from html in POST
app.use(methodOverride());                  // simulate DELETE and PUT

router.get('/', function(req, res, next) {
    res.render('index.html');
});

app.use('/', router);

var group = {
	phone: {
		id: ""
	},
	canvas: {
		id: ""
	}
}

io.on('connection', function(client) {  
    console.log('Client connected...');


    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server');

    });

    client.on('drip:canvas', function(data) {
    	group.canvas.id = client.id;
    	console.log(group);
    	// console.log(data);
    })

    client.on('drip:phone', function(data) {
    	group.phone.id = client.id;
    	// console.log(group);
    	// console.log(data);
    })

    client.on('pressed', function(data) {
    	// console.log('hi');
    	io.to(group.canvas.id).emit('pressed', data);
    })
    client.on("paint", function(data){
    	console.log("EMIT PAINT @ ", data);
    	io.to(group.canvas.id).emit('paint', data);
    })
    client.on("mouse", function(data){
    	// console.log(data);
    	io.to(group.canvas.id).emit('mouse', data);
    })

 });

app.start(port);

console.log('App running on port', port);