const {User,Profil,friendShip, Friendship,Notification} = require('../db/sequelize')
const {Op, where, Model}= require('sequelize')
const { Json } = require('sequelize/lib/utils')

module.exports = (app)=>{
app.get('/messages/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({
        where: { id: userId },
        attributes: ['id', 'nom', 'prenom'],
        include: [
            {
                model: User,
                as: 'Friends',
                attributes: ['id', 'nom', 'prenom'],
                include: [{
                    model: Profil,
                    attributes: ['id', 'urlPhoto']
                }]
            },
            {
                model: Profil,
                attributes: ['id', 'urlPhoto']
            }
        ]
    });

    // Création de l'objet data avec chaque ami
    const data = [];
    if (user && user.Friends && user.Friends.length > 0) {
        user.Friends.forEach(friend => {
            data.push({
                id: friend.id,
                nom: friend.nom,
                prenom: friend.prenom,
                urlPhoto: friend.Profil ? friend.Profil.urlPhoto : null
            });
        });
    }

    return res.render('message', { amis: data, userId: userId });
})

const { Message } = require('../db/sequelize');
const { Op } = require('sequelize');

  app.get('/api/messages/:userId/:friendId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const historique = await Message.findAll({
      where: {
        [Op.or]: [
          { from: userId, to: friendId },
          { from: friendId, to: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    res.json(historique);
  });
}