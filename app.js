const express = require("express");
const {
  initDB,
  User,
  Post,
  Like,
  Comment,
  Profil,
  Message,
} = require("./src/db/sequelize"); // Ajoute Message ici
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const path = require("path"); // Importer le module path pour gérer les chemins de fichiers
const PORT = process.env.PORT || 3000;

const app = express();

// --- Configuration de Socket.IO ---
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Servir socket.io.js depuis node_modules
app.use(
  "/socket.io",
  express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
);

// Socket.IO handlers are set later (single connection block) to avoid duplicates

app.set("views", "./src/template");
app.set("view engine", "ejs");

app.use("/static", express.static(path.join(__dirname, "src/static")));

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("./partials/poster");
});

require("./src/routes/home")(app);
require("./src/routes/info-other-user")(app);
require("./src/routes/info-own-user")(app);
require("./src/routes/amis")(app);
require("./src/routes/upload")(app);
require("./src/routes/login")(app);
require("./src/routes/login-post")(app);
require("./src/routes/signup")(app);
require("./src/routes/signup-post")(app);
require("./src/routes/profilForm")(app);
require("./src/routes/postForm")(app);
require("./src/routes/postupload")(app);
require("./src/routes/données")(app);
require("./src/routes/postContSub")(app);
require("./src/routes/postContPost")(app);
require("./src/routes/like-post")(app);
require("./src/routes/post-comment")(app);
require("./src/routes/search")(app);
require("./src/routes/send_notif")(app);
require("./src/routes/lostObject")(app);
require("./src/routes/users")(app);
require("./src/routes/Event")(app);
require("./src/routes/messages")(app, io);
initDB();

// --- SOCKET.IO CHAT LOGIC ---

// ... (ton code habituel)

io.on("connection", (socket) => {
  console.log(
    "New socket connection:",
    socket.id,
    "from",
    socket.handshake.address
  );
  // Presence tracking: maintain a map of userId -> set of socket ids
  if (!global.onlineUsers) global.onlineUsers = new Map();

  socket.on("join", (userId) => {
    console.log("Socket", socket.id, "joining room", userId);
    socket.join(userId);
    try {
      const id = String(userId);
      const set = global.onlineUsers.get(id) || new Set();
      set.add(socket.id);
      global.onlineUsers.set(id, set);
      // notify others that this user is online
      socket.broadcast.emit("user-online", { userId: id });
    } catch (e) {
      console.error("join error", e);
    }
  });

  socket.on("chat message", async (data) => {
    // If the client already sent the saved message object (from POST result), don't create again
    if (
      data &&
      data.message &&
      typeof data.message === "object" &&
      data.message.id
    ) {
      // forward as-is to the recipient
      io.to(data.to).emit("chat message", data);
      return;
    }

    // Sauvegarde le message dans la base de données
    try {
      const createPayload = {
        from: data.from,
        to: data.to,
        message: "",
      };

      // Si data.message est une chaîne
      if (typeof data.message === "string") {
        createPayload.message = data.message;
      } else if (data.message && typeof data.message === "object") {
        // Si data.message est un objet (ex: contenant imageUrl et/ou message)
        createPayload.message = data.message.message || "";
        if (data.message.imageUrl) {
          createPayload.imageUrl = data.message.imageUrl;
        }
      }

      const saved = await Message.create(createPayload);
      // Envoie le message au destinataire en temps réel
      io.to(data.to).emit("chat message", {
        from: data.from,
        to: data.to,
        message: data.message,
        savedId: saved.id,
      });
    } catch (err) {
      console.error("Erreur en sauvegardant le message via socket:", err);
    }
  });

  // Typing indicator: forward typing events to the recipient
  socket.on("typing", (data) => {
    try {
      if (data && data.to) {
        io.to(data.to).emit("typing", { from: data.from, to: data.to });
      }
    } catch (err) {
      console.error("Error forwarding typing event", err);
    }
  });

  socket.on("stop typing", (data) => {
    try {
      if (data && data.to) {
        io.to(data.to).emit("stop typing", { from: data.from, to: data.to });
      }
    } catch (err) {
      console.error("Error forwarding stop typing event", err);
    }
  });

  socket.on("disconnect", () => {
    // remove socket.id from any user sets
    try {
      for (const [userId, set] of Array.from(global.onlineUsers.entries())) {
        if (set.has(socket.id)) {
          set.delete(socket.id);
          if (set.size === 0) {
            global.onlineUsers.delete(userId);
            socket.broadcast.emit("user-offline", { userId });
          } else {
            global.onlineUsers.set(userId, set);
          }
        }
      }
    } catch (e) {
      console.error("disconnect error", e);
    }
  });

  // WebRTC signaling: forward offers/answers/ICE candidates and call end events
  socket.on("call-offer", (data) => {
    try {
      console.log("call-offer from", data.from, "to", data.to);
      io.to(data.to).emit("incoming-call", { from: data.from, sdp: data.sdp });
    } catch (err) {
      console.error("Error forwarding call-offer", err);
    }
  });

  socket.on("call-answer", (data) => {
    try {
      console.log("call-answer from", data.from, "to", data.to);
      io.to(data.to).emit("call-answered", { from: data.from, sdp: data.sdp });
    } catch (err) {
      console.error("Error forwarding call-answer", err);
    }
  });

  socket.on("call-candidate", (data) => {
    try {
      io.to(data.to).emit("call-candidate", {
        from: data.from,
        candidate: data.candidate,
      });
    } catch (err) {
      console.error("Error forwarding call-candidate", err);
    }
  });

  socket.on("call-end", (data) => {
    try {
      io.to(data.to).emit("call-ended", { from: data.from });
    } catch (err) {
      console.error("Error forwarding call-end", err);
    }
  });
}); // ----------------------------

// Remplace app.listen par server.listen
server.listen(PORT, () => {
  console.log(`l'application est lancée sur http://localhost:${PORT}`);
});
