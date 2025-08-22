const { ObjetsPerdus, User, Profil } = require('../db/sequelize');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/static/images/objet_Perdus/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = (app) => {

    // 🔹 Récupérer les objets perdus
    app.get('/lost', (req, res) => {
        ObjetsPerdus.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'nom', 'prenom', 'email'],
                    include: [{
                        model: Profil,
                        attributes: ['userId', 'urlPhoto']
                    }]
                },
            ],
            distinct: true,
            order: [['createdAt', 'DESC']] // ✅ correction
        })
        .then(objs => {
            res.render('lost', { objs });
        })
        .catch(err => {
            console.error("❌ Erreur GET /lost :", err);
            res.status(500).json({ error: err.message });
        });
    });

    // 🔹 Créer un objet perdu
    app.post('/lost', upload.single('image'), (req, res) => {
        const { description, userId } = req.body;
        const image = req.file ? req.file.filename : null; // ✅ sécurité

        User.findByPk(userId)
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: "Cet utilisateur n'existe pas" });
            }

            if (!description) {
                return res.status(400).json({ message: "Veuillez remplir le champ description !" });
            }

            return ObjetsPerdus.create({ description, userId, image })
                .then(p => res.status(200).json({ message: p.id }));
        })
        .catch(err => {
            console.error("❌ Erreur POST /lost :", err);
            res.status(500).json({ error: err.message });
        });
    });
};
