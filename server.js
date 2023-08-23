const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 8000;

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

const clients = {};

// This code generates unique userid for every user
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}

wss.on('connection', (ws) => {
    console.log('Client connected');
    const clientId = getUniqueID();
    clients[clientId] = ws;
    console.log('Client registered');
    ws.onmessage = function (event) {
        console.log('Message received');
        for(const key in clients) {
            if(key !== clientId) {
              clients[key].send(event.data);
            }
        }
        console.log('Message sent to all connected clients');
    }

    ws.on('error', (error) => console.log(error));

    ws.on('close', () => console.log('Client disconnected'));
});