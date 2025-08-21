const { Model } = require('sequelize');
const {User, Profil} = require('../db/sequelize');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = async (app) =>{
    app.post('/login', (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe sont requis" });
        }
        User.findOne({
            where: {
                email: email
            },
            include: [{
                model: Profil,  // "model" au lieu de "Model"
                attributes: ['urlPhoto']
            }]
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            
            // if (user.password !== password) {
            //     return res.status(401).json({ error: "Mot de passe incorrect" });
            // }
            bcrypt.compare(password,user.password)
            
            .then(estValide=> {
                if(!estValide){
                    console.log('mot de pass incorect')
                    return res.status(401).json({ error: "Mot de passe incorrect" });

                }
                const token = jwt.sign(
                    {
                    userId : user.id,
                    userNom : `${user.nom} ` ,
                    userPrenom : `${user.prenom}`,
                    all:`${user.prenom} ${user.nom}`,
                    photo : user.Profil.urlPhoto
                    },
                    'Abdoulaye',
                    {expiresIn : '24h'}
                )
                return res.json({token})
            })
            .catch(() => {
            })

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err.message });
        });
    });
}