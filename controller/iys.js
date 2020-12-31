var https = require('https');
class IysController {
  api(req, res, next) {
    console.log(req.body);
    let reqBody = req.body;
    const { isLoginRequest } = reqBody;
    const { serviceURL } = reqBody;
    const { data } = reqBody;
    const { token } = reqBody;
    let options = {};
    if (isLoginRequest) {
      options = {
        host: "api.sandbox.iys.org.tr",
        port: 443,
        path: serviceURL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      };
    } else {
      options = {
        host: "api.sandbox.iys.org.tr",
        port: 443,
        path: serviceURL,
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      };
    }
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

     
  }
}
module.exports = new IysController();
