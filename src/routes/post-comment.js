const { where } = require('sequelize')
const {Comment, Post} = require('../db/sequelize')
const nblike = require('../models/nblike')
const post = require('../models/post')

module.exports =  (app) =>{
    app.post('/post-comment',async(req,res)=>{
        const contenu = req.body.contenu
        const PostId = req.body.postId
        const UserId = req.body.userId

        console.log(PostId)
        console.log(UserId)
        console.log(contenu)

        // const {contenu,postId,userId} = {req.body.contenu,}

        const resp = await Comment.create({
            contenu,
            PostId,
            UserId
        })
        await Comment.findAndCountAll({
            where:{
                PostId
            }
        })
        .then(({count,rows}) =>{
            console.log(count)
            Post.update({nbcomment:count},
                {
                    where :{
                        id:PostId,
                    }
                }
            )
            return res.json({resp,count

                
            })
        })




        


    })
}