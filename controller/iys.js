var https = require("https");
const ApiError = require("../error/ApiError");
class IysController {
  api(req, res, next) {
    console.log(req.body);
    let reqBody = req.body;
    const { isLoginRequest } = reqBody;
    const { serviceURL } = reqBody;
    const { data } = reqBody;
    const { token } = reqBody;
    const { host } = reqBody;
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
module.exports = new IysController();
