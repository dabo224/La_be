const { User, Post, Like, Comment, Profil, PostImage } = require('../db/sequelize');
const Sequelize = require('sequelize');

module.exports = (app) => {
    app.get('/home', (req, res) => {
        Post.findAll({
            include: [
                {
                    model: User,  // Auteur du post
                    attributes: ['id', 'nom', 'prenom', 'email'],
                    include: [{

                        model: Profil,
                        attributes: ['userId', 'urlPhoto']

                        
                    }]
                },
                {
                    model: Like,  // Récupère les commentaires
                    attributes: ['id'],
                    include: [{
                        model: User, // Ajoute les infos de l'utilisateur qui a commenté
                        attributes: ['id']
                    }]
                },
                {
                    model: Comment,  // Récupère les commentaires
                    attributes: ['id', 'contenu', 'userId', 'postId', 'createdAt'],
                    include: [{
                        model: User, // Ajoute les infos de l'utilisateur qui a commenté
                        attributes: ['id', 'nom', 'prenom'],
                        include: [{
                            model: Profil,
                            attributes: ['userId', 'urlPhoto']
                        }]
                    }]
                },
                {
                    model: PostImage, // Récupère l'image du post
                    attributes: ['id', 'urlPhoto', 'postId']
                }
            ],
            group: ['Post.id', 'User.id', 'User->Profil.userId', 'Comments.id', 'Comments->User.id', 'Comments->User->Profil.userId','Likes.id', 'Likes->User.id'], // Groupement pour éviter les doublons
            order: [['createdAt', 'DESC']] // Trie les posts du plus récent au plus ancien
        })
        .then(posts => {
            res.render('acueil', { posts });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
        
    });

};
