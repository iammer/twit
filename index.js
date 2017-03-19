#!/usr/bin/env node

const express = require('express');
const http = require('http');
const socketIO = require('socket.io')
const morgan = require('morgan');
const fs = require('fs');
const readline = require('readline'); 

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(morgan('combined'));

app.use('/js', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/public'));

app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/public/login.html');
});

const msgs = [];
fs.stat('messages.lst', err => {
    if (!err) {
        const rl = readline.createInterface({
            input: fs.createReadStream('messages.lst')
        });

        rl.on('line', line => msgs.push(JSON.parse(line)));
    }
});

app.get('/messages', (req, resp) => {
    resp.send(msgs.slice(-20));
});

app.get('/:name', (req, resp) => {
    const name = req.params.name;
    if (name.length <= 3) {
        console.log(`${name} has logged in`);
        resp.sendFile(__dirname + '/public/index.html');
    } else {
        resp.sendFile(__dirname + '/public/login.html');
    }
});

io.on('connect', socket => {
    socket.on('message', msg => {
        console.log(msg);
        if (msg.from.length <= 3 && msg.msg.length <= 11) {
            const validMsg = {
                from: msg.from,
                msg: msg.msg,
                time: Date.now()
            };
            msgs.push(validMsg);
            fs.appendFile('messages.lst',JSON.stringify(validMsg) + "\n");
            io.emit('message', validMsg);
        }
    });
});

server.listen(8080);
console.log('Started');


