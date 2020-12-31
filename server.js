var express = require('express');
var app = express();
var https = require('https');
const router = require('./routes');
PORT = 8888

app.use(express.json()); //Used to parse JSON bodies
app.use('/', router);
app.listen(PORT);
console.log("listenting on port "+PORT)