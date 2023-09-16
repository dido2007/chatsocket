const express = require("express");
const http = require("http").createServer(express());
const cors = require('cors');
const saveMessage = require('./utils/saveMessage');


const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const mongoose = require('mongoose');


const app = express();
app.use(express.json()); // Pour gérer le body des requêtes POST




// DATABASE CONNECTION
mongoose.connect('mongodb+srv://gamenotcreator:didou1234@webapp.mymezal.mongodb.net/DJOBY', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log('Error in connecting to the database'));
db.once('open', () => console.log('Connected to the Database'));



io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");
  
  socket.on("join room", ({ to, from }) => {
    const roomName = [to, from].sort().join('+');
    socket.join(roomName);
    console.log(`A user joined room: ${roomName}`);
  });
  

  socket.on("private message", async (message) => {
    const { to, from } = message;
    const roomName = [to, from].sort().join('+');
    io.to(roomName).emit("private message", message);
    await saveMessage(message);
    console.log("Message privé reçu", message);
  });
  

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});




const PORT = process.env.PORT || 8000;
http.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
