const {User} = require('../db/sequelize');
const {UniqueConstraintError} = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (app) =>{
    app.post('/signup',(req,res) => {

        if(!req.body){
            return res.json('veillez remplir les champs du formulaire ')
        }

        
        const {nom,prenom,email,password} = req.body
        bcrypt.hash(password,10)
        .then(hash => {
            
            User.create({
                nom,prenom,email,password : hash
            })
            
            .then(user => res.json(user))
            .catch(err => {
                if (err instanceof UniqueConstraintError){
                    return res.status(404).json({error : 'Cet email est déjà utilisé'})
                }
                res.status(500).json({error : 'Erreur lors du chargement veillez réessayer plustard'})
            })
        })
    })
}