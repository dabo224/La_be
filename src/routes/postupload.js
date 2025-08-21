const { PostImage } = require('../db/sequelize'); // Importer les modèles et la fonction d'initialisation de la base de données
const multer = require('multer'); // Importer le module multer pour gérer les téléchargements de fichiers
const path = require('path'); // Importer le module path pour gérer les chemins de fichiers
const profil = require('../models/profil');


// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/static/images/posts/'); // Spécifier le dossier de destination des fichiers téléchargés
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp et conserver l'extension d'origine
    }
});

const upload = multer({ storage: storage }); // Créer une instance de multer avec la configuration de stockage


// Route pour télécharger une image
module.exports = (app) =>{

    app.post('/Post/:postId', upload.single('image'), (req, res) => {
        console.log(req.params.id)
        PostImage.create({
            urlPhoto : req.file.filename,
            postId : req.params.postId
        }).then(p => res.json(p))
    });
}


