const {Event,User, EventImage,Profil} = require('../db/sequelize');
const multer = require('multer'); // Importer le module multer pour gérer les téléchargements de fichiers
const path = require('path'); // Importer le module path pour gérer les chemins de fichiers


module.exports = (app) =>{

        app.get('/event',(req,res)=>{
        Event.findAll({
            include: [
                {

                    model : EventImage,
                    attributes : ['id','urlPhoto','evnentId']
                },
                {
                    model: User,  // Auteur du post
                    attributes: ['id', 'nom', 'prenom', 'email'],
                    include: [{

                        model: Profil,
                        attributes: ['userId', 'urlPhoto']

                        
                    }]
                },
            ],
            group: ['Event.id', 'User.id', 'User->Profil.userId'], // Groupement pour éviter les doublons
            order: [['createdAt', 'DESC']] // Trie les posts du plus récent au plus ancien
        })
        .then(events =>{
            return res.render('event',{events})
        })
    })

    app.post('/event',(req,res) =>{

        const {description,userId} = req.body

        console.log(description,userId)

        User.findByPk(userId)
        .then((user)=>{
            if(user){

                if(description ){
    
                    Event.create({Description :description,userId})
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
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './src/static/images/evenements/'); // Spécifier le dossier de destination des fichiers téléchargés
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp et conserver l'extension d'origine
        }
    });

    const upload = multer({ storage: storage }); // Créer une instance de multer avec la configuration de stockage


// Route pour télécharger une image

    app.post('/event/:eventId', upload.single('image'), (req, res) => {
        console.log(req.params.eventId)
        EventImage.create({
            urlPhoto : req.file.filename,
            evnentId : req.params.eventId
        }).then(p => res.json(p))
    });




}