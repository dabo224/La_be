const {ObjetsPerdus,User,Profil} = require('../db/sequelize');
const multer = require('multer'); // Importer le module multer pour gérer les téléchargements de fichiers
const path = require('path'); // Importer le module path pour gérer les chemins de fichiers

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/static/images/objet_Perdus/'); // Spécifier le dossier de destination des fichiers téléchargés
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp et conserver l'extension d'origine
    }
});

const upload = multer({ storage: storage }); // Créer une instance de multer avec la configuration de stockage

module.exports = (app) =>{

    app.get('/lost',(req,res)=>{
        ObjetsPerdus.findAll({
            include: [
                {
                    model: User,  // Auteur du post
                    attributes: ['id', 'nom', 'prenom', 'email'],
                    include: [{

                        model: Profil,
                        attributes: ['userId', 'urlPhoto']

                        
                    }]
                },
            ],
            group: ['ObjetPerdu.id', 'User.id', 'User->Profil.userId'], // Groupement pour éviter les doublons
            order: [['createdAt', 'DESC']] // Trie les posts du plus récent au plus ancien
        })
        .then(objs =>{
            res.render('lost',{objs})
        })
    })

    app.post('/lost',upload.single('image'),(req,res) =>{

        const {description,userId} = req.body

        console.log(req.file.filename)
        User.findByPk(userId)
        .then((user)=>{
            if(user){

                if(description ){
    
                    ObjetsPerdus.create({description,userId,image:req.file.filename})
                    .then(p =>{
                        res.status(200).json({message : p.id})

                    })
    
                }
                else{
                    res.status(400).json({message:'veillez le champ contenu !'})
                }
            }
            else{
                res.status(400).json({error : `cet utilisateur n'existe pas`})
            }
        })
        .catch(e=>{
            res.status(500).json({error : e})
        })


    })




    // Configuration de multer pour le stockage des fichiers


// Route pour télécharger une image





}