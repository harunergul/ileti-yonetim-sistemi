var express = require('express');
var app = express();
const router = require('./routes');
const apiErrorHandler = require('./error/api-error-handler');
PORT = 8888

app.use(express.json()); //Used to parse JSON bodies
app.use('/', router);
app.use(apiErrorHandler)
app.listen(PORT);
console.log("listenting on port "+PORT)