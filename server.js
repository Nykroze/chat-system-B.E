//appel
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

// liste des utilisateurs connéctés 

 // socket.emit('usersList', Object.values(users));  // envoie de la liste a revoir ou a prévoir

// Socket.IO
// message de bienvenue avec pseudo choisi => voir script frontEnd
io.on('connection', (socket) => {
    let users={};

    socket.on('setPseudo', (pseudo)=>{
        users[socket.id]=pseudo;
        socket.broadcast.emit('newUser',pseudo)
        
    });
    //message de bienvenue log
    console.log(`Utilisateur connecté ${socket.id}`);
    socket.on('userName', (userName) => {
        console.log(`Nom de l'utilisateur : ${userName}`);
    });

    //gestion des messages
    socket.on('message', (msg) => {
        const messageId= { text: msg.text,id: socket.id , pseudo: users[socket.id] };

        io.emit('message',messageId);


 console.log(`Message reçu de la part de " ${users[socket.id]} "`);
    });
// deconnexion de serv
    socket.on('disconnect', () => {
        console.log(`utilisateur ${users[socket.id]} déconnecté`);
        socket.broadcast.emit('userLeft', users[socket.id]);
        delete users[socket.id];
    });
});

// start du serveur
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port : ${PORT}`);
});