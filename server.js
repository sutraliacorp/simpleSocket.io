var express = require("express");
var app =express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);


users = [];
connections = [];

server.listen(process.env.PORT || 1991);
console.log("server running");

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));
io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log('connected : %s socket connected ', connections.length);

	console.log(socket.id);

	//disconnected

	socket.on('disconect',function(){
		users.splice(users.indexOf(socket.username),1);
		updateUsernames();
		connections.splice(connections.indexOf(socket),1);
		console.log('disconected: %s socket connected ', connections.length);

	});

	//send message

	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message',{msg:data,user:socket.username});
	});

	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		io.sockets.emit('myprofile',{me:data});
		updateUsernames();
	});

	//getprofile



	function updateUsernames(){
		io.sockets.emit('get users', users);
	}


	
})