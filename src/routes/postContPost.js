const {Post,User} = require('../db/sequelize');

module.exports = (app) =>{

    app.post('/post',(req,res) =>{

        const {titre,contenu,userID} = req.body

        User.findByPk(userID)
        .then((user)=>{
            if(user){

                if(contenu ){
    
                    Post.create({titre: "bonjour",contenu,userID,nblike:0,nbcomment:0})
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
}