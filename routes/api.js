const express = require('express')
const router = express.Router()

router.use('/products' , require('./api/products'))

module.exports = router
