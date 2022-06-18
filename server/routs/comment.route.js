const router = require('express').Router()
const Comment = require('../models/Comment')
const mongoose = require('mongoose')

router.get('/', async (req, res) => {
  const { page, product, user } = req.query
  const productId = mongoose.Types.ObjectId(product)
  const skip = parseInt(page) * 3;
  try {
    const comments = await Comment.aggregate([
      {$match: {product: productId}},
      {$addFields: {
        uped: {$in : [ user, "$up" ]},
        downed: {$in : [ user, "$down" ]},
        avgup: {$subtract: [{$size: "$up"}, {$size: "$down"}] },
        id: "$_id"
      }},
      {$project: {up: 0, down: 0}},
      {$lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userdata",
        pipeline: [{$project: {name: 1, image: 1}}]
      }},
      {$sort: {
        avgup: -1
      }},
      {$skip: skip},
      {$limit: 3},
    ])
    const commentsCount = await Comment.count({product})
    res.status(200).json({comments, commentsCount})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/', async (req, res) => {
  const {product, user, comment} = req.body
  try {
    newComment = new Comment({product, user, comment})
    await newComment.save()
    res.status(200).json(newComment)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/commentup/:id', async (req, res) => {
  const { id } = req.params
  const { user } = req.body
  try {
    const commentUpExist = await Comment.findOne({_id: id, up: [user]})
    if (commentUpExist) {
      return res.status(400).json('some thing went wrong')
    }
    
    await Comment.updateOne({_id: id}, {$push: {up: user}})
    res.status(200).json('updated successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/commentdown/:id', async (req, res) => {
  const { id } = req.params
  const { user } = req.body
  try {
    const commentUpExist = await Comment.findOne({_id: id, up: [user]})
    if (commentUpExist) {
      return res.status(400).json('some thing went wrong')
    }
    
    await Comment.updateOne({_id: id}, {$push: {down: user}})
    res.status(200).json('updated successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/removeupdown/:id', async (req, res) => {
  const { id } = req.params
  const { user, up } = req.body
  try{
    if (up) {
      await Comment.updateOne({_id: id}, {$pull: {up: user}})
    } else {
      await Comment.updateOne({_id: id}, {$pull: {down: user}})
    }
    res.status(200).json('updated successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
}) 


router.delete('/:id', async (req, res) => {
  const {id} = req.params
  try {
    await Comment.deleteOne({_id: id})
    res.status(200).json('deleted successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router