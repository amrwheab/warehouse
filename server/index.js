const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const app = express();
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log('database connected')
})

// routes

const productRouter = require('./routs/products.route')
const categoryRouter = require('./routs/categories.route')

// requests

app.use('/products', productRouter)
app.use('/categories', categoryRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT ,() => {
  console.log('server works on port', PORT)
})