const { Where } = require('sequelize/lib/utils');
const {User,PostImage, Post, Like ,Comment,Profil,Notification} = require('../db/sequelize');
const Sequelize = require('sequelize');



module.exports = (app) => {

    app.get('/user/:userId/:senderId', (req, res) => {
        const senderId = req.params.senderId
        const userId = req.params.userId; // 🔹 Récupère l'ID de l'utilisateur depuis l'URL
        if(req.query.info){
            const userId = req.params.userId; // 🔹 Récupère l'ID de l'utilisateur depuis l'URL
      
            User.findOne({  // 🔹 Utilise `findOne` au lieu de `findAll` car on récupère UN seul utilisateur
                where: { id: userId },  // 🔹 Filtre par ID d'utilisateur
    
                include : [
                    {
                    model : Profil,
                    attributes : ['id','urlPhoto']
                    },
                    {
    
                        model: Post,
                        attributes: {
                        },
                        include: [
                            {
                                model : PostImage,
                                attributes : ['id','urlPhoto']
                            },
    
                            {
                                model : User,
                                attributes : {},
                                include : [
                                    {
                                        model : Profil,
                                        attributes : ['id','urlPhoto']
                                    }
                                ]
                            },
                            {
                                model: Like,
                                attributes: ['id'],
                                include :[{
                                    model : User,
                                    attributes : ['id']
                                }]
                            },
                            {
                                model: Comment,
                                attributes: ['id', 'contenu', 'userId', 'postId', 'createdAt'],
                                include: [{
                                    model: User,
                                    attributes: ['id', 'nom', 'prenom'],
                                    include : [{
                                        model : Profil,
                                        attributes : ['id','urlPhoto']
                                    }]
                                }]
                            }
                        ]
                    }
                
                ],
                group: ['User.id', 'Posts.id', 'Posts->Comments.id','Posts->User.id','Posts->User->Profil.id' ,'Posts->Comments->User.id','Posts->Comments->User->Profil.id','Posts->Likes.id', 'Posts->Likes->User.id'] // 🔹 Groupement pour éviter les doublons
            })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: "Utilisateur non trouvé" }); // 🔹 Vérifie si l'utilisateur existe
                }
                res.render('infoOwnUser',{user});
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });

            
        }
        else{
            Notification.findOne({
                where : {'userID' : userId,'senderId' : senderId,'contenu' : 1}
            })
            .then(notif =>{
                   
                User.findOne({  // Utilise `findOne` au lieu de `findAll` car on récupère UN seul utilisateur
                    where: { id: userId },  // Filtre par ID d'utilisateur
        
                    include : [
                        {
                        model : Profil,
                        attributes : ['id','urlPhoto']
                        },
                        {
        
                            model: Post,
                            attributes: {
                            },
                            include: [
                                {
                                    model : PostImage,
                                    attributes : ['id','urlPhoto']
                                },
        
                                {
                                    model : User,
                                    attributes : {},
                                    include : [
                                        {
                                            model : Profil,
                                            attributes : ['id','urlPhoto']
                                        }
                                    ]
                                },
                                {
                                    model: Like,
                                    attributes: ['id'],
                                    include :[{
                                        model : User,
                                        attributes : ['id']
                                    }]
                                },
                                {
                                    model: Comment,
                                    attributes: ['id', 'contenu', 'userId', 'postId', 'createdAt'],
                                    include: [{
                                        model: User,
                                        attributes: ['id', 'nom', 'prenom'],
                                        include : [{
                                            model : Profil,
                                            attributes : ['id','urlPhoto']
                                        }]
                                    }]
                                },
                            ]
                        },
                        
                        {
                            model : User,
                            as : 'Friends',
                            attributes : ['id','nom','prenom'],
                            where : {id : senderId},
                            required : false
    
                        }
                    ],
                    group: ['User.id', 'Posts.id', 'Posts->Comments.id','Posts->User.id','Posts->User->Profil.id' ,'Posts->Comments->User.id','Posts->Comments->User->Profil.id','Posts->Likes.id', 'Posts->Likes->User.id'] // 🔹 Groupement pour éviter les doublons
                })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ error: "Utilisateur non trouvé" }); // 🔹 Vérifie si l'utilisateur existe
                    }
                    res.render('infoUser',{user,notif});
                    // res.json(user)
                })
                .catch(err => {
                    res.status(500).json({ error: err.message });
                });

            })
        }
    });
      
      

}