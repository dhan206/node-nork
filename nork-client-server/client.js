'use strict';

var net = require('net'); //requires net
var readline = require('readline'); //requires readline
var constants = require('./lib/constants'); //requires constants, used for PORT and HOST

var rl = readline.createInterface({ //readline interface
    input: process.stdin, //in
    output: process.stdout //out
});

var PORT = constants.port; 
var HOST = constants.host;

var client = new net.Socket(); //new socket

//connects to the server on HOST and PORT
client.connect(PORT, HOST, function() {
    console.log("Welcome to Nork!\n"); //intial game message
    client.write("gamestart"); //start game message to server
});

//listens for data being sent from the server
client.on('data', function(data) {
     var echo = data.toString();
     console.log(echo); //displays the data sent from server
     rl.question("> ", function(answer) { //takes in user input
         client.write(answer); //send user input to server
     });
});

//listens for when the connection is closed
client.on('close', function() {
    console.log("Connection closed.");
});