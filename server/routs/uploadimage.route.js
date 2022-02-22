const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
  }
})

const upload = multer({ storage })

function removeFile(name) {
  const fileTest = fs.existsSync(path.join(__dirname, '..', 'uploads', name))
  if (fileTest) {
    fs.unlinkSync(path.join(__dirname, '..', 'uploads', name))
  }
}

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (req.file?.filename) {
      res.status(200).json(req.file.filename)
    } else {
      res.status(400).json('some thing went wrong')
    }
  } catch(err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.delete('/', async (req, res) => {
  const { name } = req.query
  try {
    removeFile(name)
    res.status(200).json('deleted successfully')
  } catch(err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/update', upload.single('image'),async (req, res) => {
  const { removedImg } = req.body
  try {
    removeFile(removedImg)
    console.log(req.files)
    if (req.file?.filename) {
      res.status(200).json(req.file.filename)
    } else {
      res.status(400).json('some thing went wrong')
    }
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router