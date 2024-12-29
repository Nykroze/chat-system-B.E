const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { text } = require('stream/consumers');

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



// message de bienvenue avec pseudo choisi => voir script frontEnd
io.on('connection', (socket) => {
    let userPseudo='';
    
    socket.on('setPseudo', (pseudo)=>{
        userPseudo=pseudo;
        io.emit('newUser',userPseudo)
        
    });
    //message de bienvenue
    console.log(`Utilisateur connecté ${socket.id}`);



    socket.on('userName', (userName) => {
        console.log(`Nom de l'utilisateur : ${userName}`);
    });

    //gestion des messages
    socket.on('message', (msg) => {
        const messageId= { text: msg.text,id: socket.id , pseudo: msg.pseudo  };

        io.emit('message',messageId);


 console.log(`Message reçu : ${msg} de la part de ${socket.id}`);
    });
// deconnexion de serv
    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

// start du serveur
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port : ${PORT}`);
});