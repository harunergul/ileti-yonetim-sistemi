const express = require('express')
const router = express.Router()
var querystring = require('querystring');
var http = require('http');


router.get('/', (req, resp)=>{
    resp.send("Hay")
})

module.exports = router