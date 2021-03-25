const express = require('express')
const iysController = require('../controller/iys')
const asmedController = require('../controller/asmed')
const router = express.Router()

router.post('/', iysController.api);
router.post('/getMethod', asmedController.getMethod);
router.post('/postMethod', asmedController.postMethod);
module.exports = router