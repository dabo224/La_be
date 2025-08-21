const { User,Friendship, Profil } = require('../db/sequelize');

module.exports = (app) => {
    app.get('/users/:userId/friends', async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await User.findByPk(userId, {
                include: [{
                    model: User,
                    as: 'Friends',
                    attributes: ['id', 'nom', 'prenom', 'email'],
                    through: {
                        attributes: []
                    },
                    include : [{
                        model : Profil,
                        attributes : ['id','urlPhoto']
                    }]
                }]
            });

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            res.json(user.Friends);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/friend',async (req,res) => {
        const {userId,friendId} = req.body
        console.log(userId , friendId)
        Friendship.create(req.body)
        Friendship.create({userId:friendId,friendId:userId})
        .then(friend =>{
            return res.json({friend : true})
        })
    })
};


