const { Event, User, EventImage, Profil } = require('../db/sequelize');
const multer = require('multer');
const path = require('path');

module.exports = (app) => {

    // 🔹 Liste des événements
    app.get('/event', (req, res) => {
        Event.findAll({
            include: [
                {
                    model: EventImage,
                    attributes: ['id', 'urlPhoto', 'eventId'] // ✅ corrigé
                },
                {
                    model: User,
                    attributes: ['id', 'nom', 'prenom', 'email'],
                    include: [{
                        model: Profil,
                        attributes: ['userId', 'urlPhoto']
                    }]
                },
            ],
            distinct: true, // ✅ au lieu du group
            order: [['createdAt', 'DESC']]
        })
        .then(events => res.render('event', { events }))
        .catch(err => {
            console.error("❌ Erreur GET /event :", err);
            res.status(500).json({ error: err.message });
        });
    });

    // 🔹 Créer un événement
    app.post('/event', (req, res) => {
        const { description, userId } = req.body;

        User.findByPk(userId)
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: "Cet utilisateur n'existe pas" });
            }

            if (!description) {
                return res.status(400).json({ message: "Veuillez remplir le champ description !" });
            }

            return Event.create({ description, userId }) // ✅ "description" en minuscule
                .then(p => res.status(200).json({ message: p.id }));
        })
        .catch(err => {
            console.error("❌ Erreur POST /event :", err);
            res.status(500).json({ error: err.message });
        });
    });

    // 🔹 Configurer Multer pour upload d'images
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './src/static/images/evenements/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({ storage: storage });

    // 🔹 Ajouter une image à un événement
    app.post('/event/:eventId', upload.single('image'), (req, res) => {
        const { eventId } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: "Aucune image uploadée" });
        }

        Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                return res.status(404).json({ error: "Événement introuvable" });
            }

            return EventImage.create({
                urlPhoto: req.file.filename,
                eventId: eventId // ✅ corrigé
            }).then(p => res.json(p));
        })
        .catch(err => {
            console.error("❌ Erreur POST /event/:eventId :", err);
            res.status(500).json({ error: err.message });
        });
    });
};
