const dayjs = require("dayjs");  
var https = require("https");
const winston = require('winston');
require('winston-daily-rotate-file');
const ApiError = require("../error/ApiError");


var transport = new winston.transports.DailyRotateFile({
  filename: 'asmed-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  dirname:'logs/asmed',
  maxFiles: '14d'
});

const logger = winston.createLogger({
  transports: [
    transport
   ]
});
 

let getFormattedDate = function(){
  return dayjs(new Date()).format('DD-MM-YYYY hh:mm:ss')
}

class AsmedController {
  getMethod(req, res, next) {
    logger.info("Request Date "+getFormattedDate());
    
    let reqBody = req.body;
    const { serviceURL } = reqBody;
    const { host } = reqBody;
    let { customHeader } = reqBody;
    let options = {};
    
    

    customHeader = JSON.parse(customHeader);

    options = {
      host: host,
      path: serviceURL,
      method: "GET",
      headers: customHeader,
    };

    logger.info(options);

    let httpreq = https.request(options, function (response) {
      let chunkBody = "";
      response.on("data", function (chunk) {
        chunkBody += chunk;
      });

      response.on("error", function (err) {
        logger.error(err);
        res.status(response.statusCode).send(chunkBody);
      });

      response.on("end", function () {
        logger.info(chunkBody);
        res.status(response.statusCode).send(chunkBody);
      });
    });

    httpreq.on("error", function (error) {
      logger.error(error);

      if (error.errno == "ENOTFOUND") {
         next(
          ApiError.badRequest(
            "AVC005",
            "There is a mistake in host name: " + error.hostname
          )
        );
        return;
      } else {
        console.log("ERR_OTHER");
        next(
          ApiError.badRequest(
            "AVC00X",
            "Unhandled expcetion, errno = ",
            error.code
          )
        );

        return;
      }
    });
    httpreq.end();
  }

  postMethod(req, res, next) {
    console.log("POSTMETHOD");
    console.log(new Date());
    console.log("Requested Date: " + new Date().toLocaleDateString("tr"));
    console.log(req.body);

    let reqBody = req.body;
    const { isLoginRequest } = reqBody;
    const { serviceURL } = reqBody;
    const { data } = reqBody;
    const { token } = reqBody;
    const { host } = reqBody;
    let { customHeader } = reqBody;
    let options = {};

    /*
        if (!isLoginRequest) {
          next(
            ApiError.badRequest(
              "AVC000",
              "isLoginRequest field should be in request"
            )
          );
          return;
        }
    */
    if (!serviceURL) {
      next(
        ApiError.badRequest("AVC001", "serviceURL field should be provided")
      );
      return;
    }

    if (!data) {
      next(
        ApiError.badRequest("AVC002", "data field must be provided and should ")
      );
      return;
    }

    if (!host) {
      next(ApiError.badRequest("AVC003", "host field must be provided"));
      return;
    }

    if (isLoginRequest) {
      if (customHeader) {
        console.log("POSTMETHOD-HEADER");
        customHeader = JSON.parse(customHeader);
        console.log(customHeader);
        customHeader["Content-Length"] = Buffer.byteLength(data);

        options = {
          host: host,
          port: 443,
          path: serviceURL,
          method: "POST",
          headers: customHeader,
        };
      } else {
        options = {
          host: host,
          port: 443,
          path: serviceURL,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data),
          },
        };
      }
    } else {
      if (!token) {
        next(
          ApiError.badRequest(
            "AVC004",
            "token information required for non authentication request"
          )
        );
        return;
      }
      options = {
        host: host,
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
      let chunkBody = "";
      response.on("data", function (chunk) {
        chunkBody += chunk;
        console.log(chunkBody);
      });

      response.on("end", function () {
        res.status(response.statusCode).send(chunkBody);
      });
    });

    httpreq.on("error", function (error) {
      console.log(error);

      if ((error.errno = "ENOTFOUND")) {
        next(
          ApiError.badRequest(
            "AVC005",
            "There is a mistake in host name: " + error.hostname
          )
        );
        return;
      } else {
        ("AVC00X");
        ApiError.badRequest(
          "AVC00X",
          "Unhandled expcetion, errno = ",
          error.errno
        );
        return;
      }
    });
    httpreq.write(data);
    httpreq.end();
  }
}

module.exports = new AsmedController();
