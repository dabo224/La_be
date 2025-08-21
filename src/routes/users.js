const { json } = require('express/lib/response')
const {User,Profil,friendShip, Friendship,Notification} = require('../db/sequelize')
const {Op, where, Model}= require('sequelize')
const { Json } = require('sequelize/lib/utils')

module.exports = (app)=>{
    app.get('/utilisateurs/:id',async (req,res)=>{
        const userId = req.params.id
        const data = await User.findAll({
            where : {
                id : {
                    [Op.ne] : userId
                }
            },
            attributes : ['id','nom','prenom'],
            include : [{
                model : User,
                as: 'Friends',
                where : {
                    id : userId
                },
                required : false
            },
            {

                model : Profil,
                attributes : ['id','urlPhoto']
            },
            {
                model : Notification,
                as : 'Reception',
                where : {
                    userID : userId,
                    contenu : "1"
                },
                required : false    

            },
            {
                model : Notification,
                as : 'Envoi',
                where : {
                    senderId : userId,
                    contenu : '1'
                },
                required : false
            }
            ],
            // raw : true
            // nest : true
            group : ['User.id']
        })

        // console.log(data)

        const users = []
        const attentes = []
        const amis = []
        const suggestions = []

        data.forEach(element => {
            const user = {
                id : element.id,
                nom : element.nom,
                prenom : element.prenom,
                Friends :  element.Friends[0] ? element.Friends[0].id : null,

                Profil : {
                    id : element.Profil.id,
                    urlPhoto : element.Profil.urlPhoto 
                },
                Reception : element.Reception[0] ? element.Reception[0].id : null,
                Envoi : element.Envoi[0] ? element.Envoi[0].id : null

            }
            if (user.Envoi || user.Reception){
                attentes.unshift(user)
            }
            else if(user.Friends){
                amis.unshift(user)
            }
            else{
                suggestions.unshift(user)
            }

            users.unshift(user)
        });
        // const users = []
        // const 
        // data.forEach(element => {
        //     users.unshift(element.get({plain : true}))
        // });
        // // const users = data.map(u => u.get({plain : true}))
        // console.log(data instanceof Model)
        // const users = await data.get({plain : true})
        console.log(amis)
        console.log(suggestions)
        return res.render('utilisateurs',{suggestions,amis,attentes})
        // return res.json({users : users})
    })
}