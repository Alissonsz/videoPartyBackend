const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket=> {
    console.log(socket.handshake.url);
    
});

server.listen(8000);