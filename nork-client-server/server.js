'use strict';

var net = require('net'); //requires net
var world = require('../common/world'); //requires world
var constants = require('./lib/constants'); //requires constants
var _ = require('lodash'); //requires lodash

var PORT = constants.port; 
var HOST = constants.host;

var server = net.createServer(); //creates new server

//takes in an array and value as parameters, returns whether or not
//the array contains the value.
var arrayContains = function(arr, value) {
	var contains = false;
	arr.forEach(function(item) {
		if (item === value) {
			contains = true;
		}
	})
	return contains;
}

//checks the status of the game after entering into another room, writes out the action, current //room's id and current rooms description. Ends the game when the status is win or lose
var checkStatus = function(socket, currRoom, action) {
    if (currRoom.status) {
        if (currRoom.status == 'lost') {
            socket.write(action + "\n\n" + currRoom.id + "\n" + currRoom.description + "\n\n" + "YOU LOSE!");
        } else {
            socket.write(action + "\n\n" + currRoom.id + "\n" + currRoom.description + "\n\n" + "YOU WIN!");
        }
        socket.end();
    } else {
        socket.write(action + "\n\n" + currRoom.id + "\n" + currRoom.description);
    }
}

//listens for connection from a socket
server.on('connection', function(socket) {
    var currRoom = world.rooms[0]; //currentRoom initiated with first room in world
    var inventory = []; //inventory of items
    
    //listens for data input from the socket
    socket.on('data', function(data) {
        var echo = data.toString().toLowerCase(); //formats the input
        if (echo === "gamestart") { //initial input from socket
            socket.write(currRoom.id + "\n" + currRoom.description);
        } else if (echo === 'inventory') { //'inventory' command
            socket.write("Your inventory: [" + inventory + "]");
        } else {
            if (echo.startsWith('go ')) { //'go' command
                var direction = echo.substring(3, echo.length);
                if (direction in currRoom.exits) {
                    //updates the current room
                    currRoom = _.find(world.rooms, {"id":currRoom.exits[direction].id});
                    checkStatus(socket, currRoom, 'You go ' + direction);
                } else {
                    socket.write("You cannot go in that direction.");
                }
            } else if (echo.startsWith('take ')) { //'take' command
                var item = echo.substring(5, echo.length);
                if (currRoom.items) {
                    if (arrayContains(currRoom.items, item) && !arrayContains(inventory, item)) {
                        inventory.push(item);
                        socket.write("You take " + item);
                    } else if (arrayContains(inventory, item)) {
                        socket.write("You already have a " + item + " in your inventory.");
                    } else {
                        socket.write("The item '" + item + "' does not exist in this room.");
                    }
                } else {
                    socket.write("There is nothing to take in this room.");
                }
            } else if (echo.startsWith('use ')) { //'use' command
                var useItem = echo.substring(4, echo.length);
                if(currRoom.uses) {
                    if (arrayContains(inventory, useItem) && useItem == currRoom.uses[0].item) {
                        var description = currRoom.uses[0].description;
                        //updates current room
                        currRoom = _.find(world.rooms, {"id":currRoom.uses[0].effect.goto});
                        checkStatus(socket, currRoom, description);
                    } else if (useItem != currRoom.uses[0].item) {
                        socket.write("You cannot use a " + useItem + " in this room.");
                    } else {
                        socket.write("You do not have a " + useItem + " in your inventory.");
                    }
                } else {
                    socket.write("You cannot use an item in this room.");
                }
            } else {
                socket.write("The command '" + echo + "' is not supported. The supported commands are 'go', 'take', 'use', or 'inventory'.");
            }
        }
    }); 
});

//alerts when the server is up and listening
server.on('listening', function() {
   var addr = server.address();
   console.log('server listening on port %j', addr.port); 
});

server.listen(PORT); //server listening on PORT