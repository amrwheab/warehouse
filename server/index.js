const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const app = express();
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
mongoose.connect(process.env.MONGODB_URL, (err) => {
  if (err) return console.log('db connection error')
  console.log('database connected')
})

// routes
const productRouter = require('./routs/products.route')
const categoryRouter = require('./routs/categories.route')
const imageUploadRouter = require('./routs/uploadimage.route')
const carouselRouter = require('./routs/carousel.route')
const footerRouter = require('./routs/footer.route')
const userRouter = require('./routs/user.route')

// requests
app.use('/products', productRouter)
app.use('/categories', categoryRouter)
app.use('/uploadimage', imageUploadRouter)
app.use('/carousel', carouselRouter)
app.use('/footer', footerRouter)
app.use('/user', userRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT ,() => {
  console.log('server works on port', PORT)
})