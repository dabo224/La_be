const { User, Profil, Friendship, Notification } = require('../db/sequelize');
const { Op } = require('sequelize');

module.exports = (app) => {
    app.get('/utilisateurs/:id', async (req, res) => {
        const userId = req.params.id;

        try {
            const data = await User.findAll({
                where: {
                    id: { [Op.ne]: userId }
                },
                attributes: ['id', 'nom', 'prenom'],
                include: [
                    {
                        model: User,
                        as: 'Friends',
                        where: { id: userId },
                        required: false
                    },
                    {
                        model: Profil,
                        attributes: ['id', 'urlPhoto'],
                        required: false
                    },
                    {
                        model: Notification,
                        as: 'Reception',
                        where: { userID: userId, contenu: "1" },
                        required: false
                    },
                    {
                        model: Notification,
                        as: 'Envoi',
                        where: { senderId: userId, contenu: '1' },
                        required: false
                    }
                ],
                distinct: true,
                order: [['nom', 'ASC']]
            });

            const attentes = [];
            const amis = [];
            const suggestions = [];

            const users = data.map(el => {
                const user = {
                    id: el.id,
                    nom: el.nom,
                    prenom: el.prenom,
                    Friends: el.Friends && el.Friends[0] ? el.Friends[0].id : null,
                    Profil: el.Profil ? { id: el.Profil.id, urlPhoto: el.Profil.urlPhoto } : null,
                    Reception: el.Reception && el.Reception[0] ? el.Reception[0].id : null,
                    Envoi: el.Envoi && el.Envoi[0] ? el.Envoi[0].id : null
                };

                if (user.Envoi || user.Reception) attentes.unshift(user);
                else if (user.Friends) amis.unshift(user);
                else suggestions.unshift(user);

                return user;
            });

            return res.render('utilisateurs', { suggestions, amis, attentes });
        } catch (err) {
            console.error("❌ Erreur GET /utilisateurs/:id :", err);
            return res.status(500).json({ error: err.message, stack: err.stack });
        }
    });
};
