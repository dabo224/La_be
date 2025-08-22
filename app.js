const express = require('express'); 
const { initDB, User, Post, Like, Comment, Profil, Message } = require('./src/db/sequelize'); // Ajoute Message ici
const bodyParser = require('body-parser');
const {Sequelize} = require('sequelize');
const path = require('path'); // Importer le module path pour gérer les chemins de fichiers
const PORT = process.env.PORT || 3000;

const app = express();

// --- AJOUT POUR SOCKET.IO ---
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
// ----------------------------

app.set('views', './src/template');
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'src/static')));

app.use(express.json())
app.use((req,res,next) =>{
  console.log(req.url)
  next()
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.get('/',(req,res)=>{
  res.render('./partials/poster')
})

require('./src/routes/home')(app)
require('./src/routes/info-other-user')(app)
require('./src/routes/info-own-user')(app)
require('./src/routes/amis')(app)
require('./src/routes/upload')(app)
require('./src/routes/login')(app)
require('./src/routes/login-post')(app)
require('./src/routes/signup')(app)
require('./src/routes/signup-post')(app)
require('./src/routes/profilForm')(app)
require('./src/routes/postForm')(app)
require('./src/routes/postupload')(app)
require('./src/routes/données')(app)
require('./src/routes/postContSub')(app)
require('./src/routes/postContPost')(app)
require('./src/routes/like-post')(app)
require('./src/routes/post-comment')(app)
require('./src/routes/send_notif')(app)
require('./src/routes/lostObject')(app)
require('./src/routes/users')(app)
require('./src/routes/Event')(app)
require('./src/routes/messages')(app);
initDB();

// --- SOCKET.IO CHAT LOGIC ---

// ... (ton code habituel)

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('chat message', async (data) => {
    // Sauvegarde le message dans la base de données
    await Message.create({
      from: data.from,
      to: data.to,
      message: data.message
    });
    // Envoie le message au destinataire en temps réel
    io.to(data.to).emit('chat message', data);
  });
});// ----------------------------

// Remplace app.listen par server.listen
server.listen(PORT, () => {
  console.log(`l'application est lancée sur http://localhost:${PORT}`);
});