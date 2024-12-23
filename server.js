const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware pour CORS
app.use(cors());

// fichiers statiques
app.use(express.static(path.join(__dirname, '../front/public')));

// route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/public/index.html')); 
});

// Socket.IO
io.on('connection', (socket) => {
    console.log('Utilisateur connecté');

    socket.on('message', (msg) => {
        const serveMesaage=`server a reçu:${msg}`
        console.log(`Message reçu : ${msg}`);
        io.emit('message', serveMesaage);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

// start du serveur
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port : ${PORT}`);
});