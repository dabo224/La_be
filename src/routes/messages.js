const {
  User,
  Profil,
  friendShip,
  Friendship,
  Notification,
} = require("../db/sequelize");
const { Op, where, Model } = require("sequelize");
const { Json } = require("sequelize/lib/utils");

module.exports = (app, io) => {
  app.get("/messages/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "nom", "prenom"],
      include: [
        {
          model: User,
          as: "Friends",
          attributes: ["id", "nom", "prenom"],
          include: [
            {
              model: Profil,
              attributes: ["id", "urlPhoto"],
            },
          ],
        },
        {
          model: Profil,
          attributes: ["id", "urlPhoto"],
        },
      ],
    });

    // Création de l'objet data avec chaque ami
    const data = [];
    if (user && user.Friends && user.Friends.length > 0) {
      user.Friends.forEach((friend) => {
        data.push({
          id: friend.id,
          nom: friend.nom,
          prenom: friend.prenom,
          urlPhoto: friend.Profil ? friend.Profil.urlPhoto : null,
        });
      });
    }

    return res.render("message", { amis: data, userId: userId });
  });

  const { Message } = require("../db/sequelize");
  const { Op } = require("sequelize");
  const multer = require("multer");
  const path = require("path");

  // multer setup to store in src/static/messages
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "static", "messages"));
    },
    filename: function (req, file, cb) {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  app.get("/api/messages/:userId/:friendId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const historique = await Message.findAll({
      where: {
        [Op.or]: [
          { from: userId, to: friendId },
          { from: friendId, to: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    res.json(historique);
  });

  // Endpoint to send a message (text, image or audio)
  app.post("/api/messages/send", upload.single("image"), async (req, res) => {
    try {
      const sender = req.body.sender_id || req.body.from;
      const receiver = req.body.receiver_id || req.body.to;
      const content = req.body.content || req.body.message || "";

      const createPayload = {
        from: sender,
        to: receiver,
        message: content,
      };

      if (req.file) {
        // expose via /static/messages/<filename>
        const url = "/static/messages/" + req.file.filename;
        // If the uploaded file is audio, set audioUrl, otherwise imageUrl
        const mimetype = req.file.mimetype || "";
        if (mimetype.startsWith("audio/")) {
          createPayload.audioUrl = url;
        } else {
          createPayload.imageUrl = url;
        }
      }

      const saved = await Message.create(createPayload);

      // Emit to receiver(s)
      if (io && receiver) {
        try {
          console.log(
            "Emitting new_message to room",
            String(receiver),
            "messageId",
            saved.id
          );
          io.to(String(receiver)).emit("new_message", { message: saved });
        } catch (e) {
          console.error("Error emitting new_message", e);
        }
      }

      return res.json({ success: true, message: saved });
    } catch (err) {
      console.error("Error in /api/messages/send", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update message (edit content)
  app.put("/api/messages/:id", upload.none(), async (req, res) => {
    try {
      const id = req.params.id;
      const content = req.body.content || req.body.message || "";
      const msg = await Message.findByPk(id);
      if (!msg)
        return res
          .status(404)
          .json({ success: false, error: "Message not found" });
      msg.message = content;
      await msg.save();
      // notify via socket
      if (io) io.emit("message updated", { message: msg });
      return res.json({ success: true, message: msg });
    } catch (err) {
      console.error("Error updating message", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
};
