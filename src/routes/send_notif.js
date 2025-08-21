const { where } = require('sequelize')
const {User,Notification, Profil} = require('../db/sequelize')
const user = require('../models/user')

module.exports =  (app)=>{
    
    app.post('/notif',async (req,res) =>{
        const {senderId,userID} = req.body

        const vu = await User.findByPk(userID)
        const vs =await User.findByPk(senderId)

        if(vu && vs){
            if(req){
                
                Notification.create({
                    contenu : 0,
                    userID : senderId,
                    senderId : userID
                })
                .then(()=>{
                    Notification.create({
                        contenu : 1,
                        userID,
                        senderId
                    })
                    .then((notif)=> {
                        return res.json(notif.id)
                    })    

                })
    
            }            
            // if(req){
            //     Notification.create({
            //         contenu : 2,
            //         userID,
            //         senderId
            //     })
            //     .then((notif)=> {
            //         return res.json(notif.id)
            //     })
            // }

        }
        else if(vu && !vs){
            return res.json({error : `votre id n'existe pas dans la base de donnée`})
        }
        else if (!vu && vs){
            return res.status(404).json({error : `Cet utilisateur n'existe pa`})

        }
        else{
            return res.status(400).json({error : `Erreur veuillez réessayer plus tard`})

        }
    })
    app.get('/notifs/:userId',(req,res)=>{
        const userId = req.params.userId
        User.findOne({
            where : {id : userId},
            attributes : ['id'],
            include : {
                model: Notification,
                attributes: ['id', 'contenu', 'senderId', 'userID','createdAt'],
                as : 'Envoi',
                include : ['userId'],
                include: [{
                    model: User,
                    attributes: ['id', 'nom', 'prenom'],
                    include : [{
                        model : Profil,
                        attributes : ['id','urlPhoto']
                    }]
                }]
            },
            order : [['createdAt','DESC']],
            group :['User.id','Envoi.id','Envoi->User.id','Envoi->User->Profil.id'],
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" }); // Vérifie si l'utilisateur existe
            }
            res.render('notifications',{user});
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });


    })

    app.delete('/notif/:notifId',async (req,res) =>{
        const deleteId = req.params.notifId
        Notification.findByPk(deleteId)
        .then( async notif =>{

            if (req.query.all){
                // const senderId = notif.userId
                // const userID = notif.senderId
    
                console.log('query ok')
    
                await Notification.destroy({where : {userID : notif.senderId , senderId : notif.userID}})
            }
    
    
            Notification.destroy({where:{'id': deleteId}})
            .then(()=>{
                return res.json({delete:true})
            })
        })
    })


}