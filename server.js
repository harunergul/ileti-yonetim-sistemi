var express = require('express');
var https = require('https');

var app = express();
PORT = 8888

app.use(express.json()); //Used to parse JSON bodies

app.post('/', function (req, res) {

  console.log(req.body)
  let isLoginRequest = req.body['isLoginRequest']
  let data = req.body['data'];
  let path = req.body['serviceURL'];
  let token = req.body['token'];
  if(isLoginRequest){
    var options = {
      host: 'api.sandbox.iys.org.tr',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
  }else{

    var options = {
      host: 'api.sandbox.iys.org.tr',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json', 
        'Content-Length': Buffer.byteLength(data)
      }

    };

  }
  

  

  // let data = JSON.stringify({
  //   "username": "eeecfcec-ee81-4ebb-82a1-5a2036bfcd1e",
  //   "password": "1KSu[aQ:",
  //   "grant_type":"password"
  // })
  
  

  var httpreq = https.request(options, function (response) {
   
    let chunkBody = ""
    response.on('data', function (chunk) {
      chunkBody = ""+chunk;
     });

    response.on('end', function() { 
        res.status(response.statusCode).send(chunkBody);
    })
  });
  httpreq.write(data); 
  httpreq.end();
})

app.listen(PORT);
console.log("listenting on port "+PORT)