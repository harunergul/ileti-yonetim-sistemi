let https = require("https");
const dayjs = require("dayjs"); 
const winston = require('winston');
require('winston-daily-rotate-file'); 
const ApiError = require("../error/ApiError");

var transport = new winston.transports.DailyRotateFile({
  filename: 'iys-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  dirname:'logs/iys',
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
class IysController {
  api(req, res, next) {
    logger.info("--------")
    logger.info("Request Date "+getFormattedDate());

    let reqBody = req.body;
    const { isLoginRequest } = reqBody;
    const { serviceURL } = reqBody;
    const { data } = reqBody;
    const { token } = reqBody;
    const { host } = reqBody;
    let options = {};

    logger.info(options)

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
      logger.error("ServiceURL does not exist in the request body");
      next(
        ApiError.badRequest("AVC001", "serviceURL field should be provided")
      );
      return;
    }

    if (!data) {
      logger.error("Data field must be provided");
      next(
        ApiError.badRequest("AVC002", "data field must be provided and should ")
      );
      return;
    }

    if (!host) {
      logger.error("Host field must be provided");
      next(ApiError.badRequest("AVC003", "host field must be provided"));
      return;
    }

    if (isLoginRequest) {
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
    } else {
      if (!token) {
        logger.error("Token required for non authentication request");
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
        chunkBody = "" + chunk;
      });

      response.on("end", function () {
        logger.info(chunkBody);
        res.status(response.statusCode).send(chunkBody);
      });
    });

    httpreq.on("error", function (error) {
      logger.error(error);
      if ((error.errno = "ENOTFOUND")) {
        next(
          ApiError.badRequest(
            "AVC005",
            "There is a mistake in host name: " + error.hostname
          )
        );
        return;
      } else {
        next(
          ApiError.badRequest(
            "AVC00X",
            "Unhandled expcetion, errno = ",
            error.errno
          )
        );
        return;
      }
    });
    httpreq.write(data);
    httpreq.end();
  }
}
module.exports = new IysController();
