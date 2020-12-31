const express = require('express')
const iysController = require('../controller/iys')
const router = express.Router()

router.post('/', iysController.api);
module.exports = router