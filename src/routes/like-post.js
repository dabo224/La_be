const { where } = require('sequelize')
const {Like, Post} = require('../db/sequelize')
const nblike = require('../models/nblike')
const { status } = require('express/lib/response')

module.exports =  (app) =>{
    app.post('/post-like/:postId/:userId',async(req,res)=>{
        const postId = req.params.postId
        const userId = req.params.userId

        const elem = await Like.findOne({
            where:{
                postId,
                userId
            }
        })

        if (elem){
            await Like.destroy({
                where:{
                    postId,
                    userId
                }
            })
            await Like.findAndCountAll({
                where:{
                    postId
                }
            })
            .then(({count,rows}) =>{

                // console.log(rows)
                Post.update({nblike:count},
                    {
                        where : {
                            id : postId
                        }
                    }

                )
                return res.json({ data: count});
            })
            
        }
        else{
            
            await Like.create({
                postId,
                userId
            })
            await Like.findAndCountAll({
                where:{
                    postId
                }
            })
            .then(({count,rows}) =>{
                Post.update({nblike:count},
                    {
                        where : {
                            id : postId
                        }
                    }

                )
                return res.json({ data: count,stat : true });
            })



        }


    })
}