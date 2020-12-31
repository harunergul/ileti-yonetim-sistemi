const ApiError = require("./ApiError");

function apiErrorHandler(err, req, resp, next) {
  //Do log error
  //Dont use console.err because it is not async
  // Use winston or bunya
  console.log(err);
  if (err instanceof ApiError) {
    resp.status(err.statusCode).json({ code: err.code, message: err.message });
    return;
  }
  resp.status(500).json("Something went wrong. check server logs");
}

module.exports = apiErrorHandler;
