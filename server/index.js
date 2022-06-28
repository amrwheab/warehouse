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

// stats
let views = 1128
const getViews = (req, res, next) => {
  views += 1
  next()
}

const getAllViews = () => {return views}

module.exports.getAllViews = getAllViews;

// routes
const productRouter = require('./routs/products.route')
const categoryRouter = require('./routs/categories.route')
const imageUploadRouter = require('./routs/uploadimage.route')
const carouselRouter = require('./routs/carousel.route')
const footerRouter = require('./routs/footer.route')
const userRouter = require('./routs/user.route')
const homeRouter = require('./routs/home.route')
const cartRouter = require('./routs/cart.route')
const likeRouter = require('./routs/like.route')
const rateRouter = require('./routs/rate.route')
const commentRouter = require('./routs/comment.route')
const orderRouter = require('./routs/order.route')
const statsRouter = require('./routs/stats.route')

// requests
app.use('/products', productRouter)
app.use('/categories', categoryRouter)
app.use('/uploadimage', imageUploadRouter)
app.use('/carousel', carouselRouter)
app.use('/footer', footerRouter)
app.use('/user', userRouter)
app.use('/home', getViews, homeRouter)
app.use('/cart', cartRouter)
app.use('/like', likeRouter)
app.use('/rate', rateRouter)
app.use('/comments', commentRouter)
app.use('/orders', orderRouter)
app.use('/stats', statsRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT ,() => {
  console.log('server works on port', PORT)
})