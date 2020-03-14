const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var activeRooms = new Object();

var events = new Object();

io.on('connection', socket=> {
    console.log(socket.handshake.url);
    socket.on('entryRoom', data => {
        socket.join(data.roomURL);
        
        let event = {type: 'join', message: "entou na sala", userName: data.userName};
        if(data.roomURL in events == false) events[data.roomURL] = [];
        events[data.roomURL].push(event);
        io.to(data.roomURL).emit('newEvent', event);
        
    });

    socket.on('newMessage', data => {
        console.log(`Received message from ${data.userName} : ${data.message}`);
        let event = {type: 'message', message: data.message, userName: data.userName};
        io.to(data.roomURL).emit('newEvent', event);
    });
    
});

server.listen(8000);