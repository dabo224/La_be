const { Profil } = require('../db/sequelize'); // Importer les modèles et la fonction d'initialisation de la base de données
const multer = require('multer'); // Importer le module multer pour gérer les téléchargements de fichiers
const path = require('path'); // Importer le module path pour gérer les chemins de fichiers


// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/static/profil/'); // Spécifier le dossier de destination des fichiers téléchargés
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp et conserver l'extension d'origine
    }
});

const upload = multer({ storage : storage }); // Créer une instance de multer avec la configuration de stockage


// Route pour télécharger une image

module.exports = (app) =>{

    app.post('/profil/:userid', upload.single('image'), (req, res) => {
        const userId = req.params.userid;
        const urlPhoto = req.file.filename;
        Profil.findOne({ where: { userId } })
        .then(existingProfile => {
            if (existingProfile) {
                console.log('profil existant')
                // throw new Error("Cet utilisateur a déjà un profil !");
                Profil.update({ urlPhoto }, { where: { userId } });
                return res.status(200).json({message : 'votre profil a été mis à jour avec success',stat : 1})

            }
            console.log('profil créé')
            Profil.create({ userId, urlPhoto });
            res.status(200).json({message:'votre profil a été crée avec success'})

        }
        )
        .catch(err => {
            res.status(500).json({ error: err.message });
        });

        // if (existingProfile) {
        //     throw new Error("Cet utilisateur a déjà un profil !");
        // }
    
        // Profil.create({ userId, urlPhoto });
    
        // Profil.create({
        //     urlPhoto : req.file.filename,
        //     userId : req.params.userid
        // }).then(p => res.json(p))
    });
}


