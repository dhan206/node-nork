'use strict';

var world = require('../common/world');
var stream = require('stream');
var _ = require('lodash');

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


var currRoom = world.rooms[0];
var inventory = [];

//checks the status of the game after entering into another room, writes out the action, current 
//room's id and current rooms description. Ends the game when the status is win or lose
var checkStatus = function(curr, action) {
    var command = '';
    if (currRoom.status) {
        if (currRoom.status == 'lost') {
            command = action + "\n\n" + curr.id + "\n" + curr.description + "\n\nYOU LOSE!";
        } else {
            command = action + "\n\n" + curr.id + "\n" + curr.description + "\n\nYOU WIN!";
        }
    } else {
        command = action + "\n\n" + curr.id + "\n" + curr.description;
    }
    return command;
}

var first = function() {
    process.stdout.write(currRoom.id + "\n\n" + currRoom.description + "\n> ");
}

var inputStream = new stream.Transform({
    transform(chunk, encoding, done) {
        var echo = chunk.toString().toLowerCase().trim();
        this.push(echo);
        done();
    },
    
    flush(done) {
        done();
    }
})

var gameStream = new stream.Transform({
    transform(chunk, encoding, done) {
        var command = '';
        chunk = chunk.toString();
        if (chunk === "gamestart") { //initial input from socket
            command = currRoom.id + "\n" + currRoom,description;
        } else if (chunk === 'inventory') { //'inventory' command
            command = 'Your inventory: ' + inventory.toString();
        } else {
            if (chunk.startsWith('go ')) { //'go' command
                var direction = chunk.substring(3, chunk.length);
                if (direction in currRoom.exits) {
                    //updates the current room
                    currRoom = _.find(world.rooms, {"id":currRoom.exits[direction].id});
                    command = checkStatus(currRoom, 'You go ' + direction);
                } else {
                    command = "You cannot go in that direction.";
                }
            } else if (chunk.startsWith('take ')) { //'take' command
                var item = chunk.substring(5, chunk.length);
                if (currRoom.items) {
                    if (arrayContains(currRoom.items, item) && !arrayContains(inventory, item)) {
                        inventory.push(item);
                        command = "You take " + item;
                    } else if (arrayContains(inventory, item)) {
                        command = "You already have a " + item + " in your inventory.";
                    } else {
                        command = "The item '" + item + "' does not exist in this room.";
                    }
                } else {
                    command = "There is nothing to take in this room.";
                }
            } else if (chunk.startsWith('use ')) { //'use' command
                var useItem = chunk.substring(4, chunk.length);
                if(currRoom.uses) {
                    if (arrayContains(inventory, useItem) && useItem == currRoom.uses[0].item) {
                        var description = currRoom.uses[0].description;
                        //updates current room
                        currRoom = _.find(world.rooms, {"id":currRoom.uses[0].effect.goto});
                        command = checkStatus(currRoom, description);
                    } else if (useItem != currRoom.uses[0].item) {
                        command = "You cannot use a " + useItem + " in this room.";
                    } else {
                        command = "You do not have a " + useItem + " in your inventory.";
                    }
                } else {
                    command = "You cannot use an item in this room.";
                }
            } else {
                command = "The command '" + chunk + "' is not supported. The supported commands are 'go', 'take', 'use', or 'inventory'.";
            }
        }
        this.push(command);
        done();
    },
    
    flush(done) {
        done();
    }
})

var outputStream = new stream.Transform({
    transform(chunk, encode, done) {
        process.stdout.write(chunk + "\n> ");
        (currRoom.status !== undefined ? process.exit() : null);
        done();
    },
    
    flush(done) {
        done();
    }
})

first();

process.stdin.pipe(inputStream).pipe(gameStream).pipe(outputStream);
