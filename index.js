#!/usr/bin/env node

const express = require('express');
const https = require('https');
const socketIO = require('socket.io')
const morgan = require('morgan');
const fs = require('fs');
const readline = require('readline'); 

const options = {
	key: fs.readFileSync(__dirname + '/certs/twit.key'),
	cert: fs.readFileSync(__dirname + '/certs/twit.cer')
};

const app = express();
const server = https.createServer(options, app);
const io = socketIO(server);

app.use(morgan('combined'));

app.use((req, resp, next) => {
    if (req.hostname !== 'twit.iammer.com') {
	console.log('Invalid hostname: ' + req.hostname);
        resp.sendStatus(404);
    } else {
        next();
    }
});

app.use('/js', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/public'));
app.use('/.well-known', express.static(__dirname + '/public/.well-known'));

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

const http = require('http');

http.createServer((req,resp) => {
   if (req.headers.host !== 'twit.iammer.com') {
        resp.writeHead(404);
	resp.end();
   } else {
        resp.writeHead(302, { Location: 'https://twit.iammer.com'});
	resp.end();
   }
}).listen(80);

server.listen(443);
console.log('Started');


