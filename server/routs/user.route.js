const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  const { user, page, search } = req.query
  const skip = (parseInt(page)-1)*8
  try {
    const userAdmin = await User.findById(user)
    if (userAdmin.mainAdmin) {
      const users = await User.find({name:  { $regex: search, $options : 'i' }}).limit(8).skip(skip)
      const count = await User.find({name:  { $regex: search, $options : 'i' }}).count()
      res.status(200).json({users, count})
    } else { 
      res.status(500).json('You aren\'t allowed')
    }
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.put('/admin', async (req, res) => {
  const { user, admin, userId } = req.body
  try {
    const userAdmin = await User.findById(user)
    if (userAdmin.mainAdmin) {
      await User.updateOne({_id: userId}, {isAdmin: admin})
      res.status(200).json('updated successfully')
    }else { 
      res.status(500).json('You aren\'t allowed')
    }
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/register', async (req, res) => {

  const { 
    name, 
    email, 
    password, 
    confirmPassword, 
    phone, 
    country, 
    city, 
    street, 
    zip
  } = req.body
  
  try {
    if (password !== confirmPassword) return res.status(400).json('passwords doesn\'t match')
    const userFound = await User.findOne({email})
    if (userFound) return res.status(400).json('user exists')
  
    const newUser = new User({
      name, 
      email, 
      phone, 
      country, 
      city, 
      street, 
      zip,
      passwordHash: bcrypt.hashSync(password, 10)
    });
  
    const user = await newUser.save()
    const token = jwt.sign({id: user._id}, process.env.JWTSECRET, {expiresIn: '1y'})
    res.status(200).json({token, user})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.findOne({email})
    if (user) {
      const validatePass = bcrypt.compareSync(password, user.passwordHash)
      if (validatePass) {
        const token = jwt.sign({id: user._id}, process.env.JWTSECRET, {expiresIn: '1y'})
        res.status(200).json({token, user})
      } else {
        res.status(401).json('wrong password')
      }
    } else {
      res.status(401).json('email doesn\'t exist')
    }
  } catch (err) {
    console.log(err)
    res.status(401).json('some thing went wrong')
  }
});

router.get('/getuser/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id).select('-password')
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})


module.exports = router