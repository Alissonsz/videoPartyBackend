const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var activeVideos = new Object();

var activeRooms = {};

io.on('connection', socket=> {
    //console.log(socket.handshake.url);
    socket.on('entryRoom', data => {
        socket.join(data.roomURL);
        socket.myRoom = data.roomURL;
        socket.myName = data.userName;
        
        let event = {type: 'join', message: "entou na sala", userName: data.userName};
        io.to(data.roomURL).emit('newEvent', event);
        socket.emit('entryRoomResponse', activeVideos[data.roomURL]);

        if(activeRooms[data.roomURL] == undefined) activeRooms[data.roomURL] = 0;
        activeRooms[data.roomURL]++;
        
    });

    socket.on('disconnect', data => {
        //console.log(`Socket disconected from ${socket.myRoom}`);
        activeRooms[socket.myRoom]--;
        
        if(activeRooms[socket.myRoom] == 0){
            delete activeRooms[socket.myRoom];
            delete activeVideos[socket.myRoom];
        }

        let event = {type: 'join', message: "deixou a sala", userName: socket.myName};
        io.to(socket.myRoom).emit('newEvent', event);

        

    });

    socket.on('changePlay', data =>{
        //console.log("rcv changePlay");
        io.to(data.roomURL).emit('changePlay', data);
    })

    socket.on('newMessage', data => {
        //console.log(`Received message from ${data.userName} : ${data.message}`);
        let event = {type: 'message', message: data.message, userName: data.userName};
        if(data.message !== '')
            io.to(data.roomURL).emit('newEvent', event);
    });

    socket.on('videoHasChange', data => {
        //console.log("new video");
        activeVideos[data.roomURL] = data.videoURL;
        io.to(data.roomURL).emit('videoHasChange', data);
    });
    
});

server.listen(process.env.PORT || 8000);