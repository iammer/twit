#!/usr/bin/env node

const express = require('express');
const http = require('http');
const socketIO = require('socket.io')
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(morgan('combined'));

app.use('/js', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/public'));

app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/public/index.html');
});

app.get('/:name', (req, resp) => {
    resp.sendFile(__dirname + '/public/index.html');
});

io.on('connection', socket =>
    socket.join('room', () =>
        socket.on('message', msg => socket.to('room', msg))
    )
);

server.listen(8080);
console.log('Started');


