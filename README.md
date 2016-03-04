# Architected Nork

This repository contains two versions of a simple text-based game called Nork, developed as part of a [course](http://arch-joelross.rhcloud.com/) at the UW iSchool. 

The below questions should be answered (in detail!) regarding your submission!


##### 1. Did you work with a partner? If so, who?
> No.



##### 2. Discuss how the different architectural styles affected the implementation of your program. Was one pattern easier to use or more effective _for this problem_? Why? How do the different styles influence the ability to add new features or modify existing functionality? What kind of changes would be easier or harder with each style?
##### This discussion should be a couple of paragraphs, giving a detailed analysis of how the styles work.
> Using the client-server architecture style for Nork affected my implementatiion of the program by forcing me to separate the functionality of the game into two files; client.js and server.js. The client file handles user input and connected to the server. The server file handles game logic, socket connects, and writes the game text-interface to the client/socket. This allowed me to separate the different parts of the program and keep related parts together. Using the pipe-filter architecture style for Nork affected my implementatino of the program by forcing me to separate the functionality of the game into three components; inputStream, gameStream, and outputStream. The inputStream componenet receives input from process.stdin via user input in terminal. The inputStream formats the data stream and pipes it into the next stream, which is the gameStream. The gameStream handles the game logic and pipes the resulting game state to the outputStream. The outputStream writes the game state to the game text-interface.

> The client-server pattern is more effective for this problem because the architecture style allows for later upgrades and added features without needing to make changes to the client. If this game were to be made avaliable for downloads, then changes/alterations to the game feature itself could be made in one place (the server.js file) and the clients that connect to the server would work without needing to be modified. The pipe-filter pattern was easier to implement because there was no need for creating servers, connecting sockets to servers, etc. It simply passed input from one filter to the next and modified the data. Although it was a very ineffective way to process the data, it was very easy to implement.

> The client-server style makes it very easy to modify and add new features to the existing program because the client and server portions of the game are separate. In order to add features modifications will only need to be made to the server.js file. The client's file will not be effected, but the changes made to the game will be evident to the client when they run the game. The pipe-filter style would make it easy to add extra streams inbetween stages of the game. For example, if the game were to be translated into another language it would be relatively easy to add that functionality to the game because it would only require creating a stream for translation and that would be placed betweem the gameStream and outputStream.

> The kinds of changes that would be easy to change while using the client-server style are game functionality and multiplayer functionality. Using the pipe-filter style, adding different languages, formatting the text-interface, and other functionality that can be added by piping the data through a filter.

##### 3. Did you add an extra features to either version of your game? If so, what?
> No.



##### 4. Approximately how many hours did it take you to complete this assignment? #####
> 10 hours.



##### 5. Did you receive help from any other sources (classmates, etc)? If so, please list who (be specific!). #####
> Kendall and Andrew helped get started with pipe and filter.



##### 6. Did you encounter any problems in this assignment we should warn students about in the future? How can we make the assignment better? #####
> No.


