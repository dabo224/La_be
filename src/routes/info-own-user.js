const {User, Post, Like ,Comment} = require('../db/sequelize');
const Sequelize = require('sequelize');



module.exports = (app) => {

    app.get('/home/users/:userId', (req, res) => {
        const userId = 1; // 🔹 Récupère l'ID de l'utilisateur depuis l'URL
      
        User.findOne({  // 🔹 Utilise `findOne` au lieu de `findAll` car on récupère UN seul utilisateur
            where: { id: userId },  // 🔹 Filtre par ID d'utilisateur
            include: [{
                model: Post,
                attributes: {
                    include: [
                        [Sequelize.fn('COUNT', Sequelize.col('Posts->Likes.id')), 'nblike'] // 🔹 Compte les likes
                    ]
                },
                include: [
                    {
                        model: Like,
                        attributes: []
                    },
                    {
                        model: Comment,
                        attributes: ['id', 'contenu', 'userId', 'postId', 'createdAt'],
                        include: [{
                            model: User,
                            attributes: ['id', 'nom', 'prenom']
                        }]
                    }
                ]
            }],
            group: ['User.id', 'Posts.id', 'Posts->Comments.id', 'Posts->Comments->User.id'] // 🔹 Groupement pour éviter les doublons
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" }); // 🔹 Vérifie si l'utilisateur existe
            }
            res.send(user);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
      });
      

}