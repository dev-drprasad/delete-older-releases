const https = require("https");

module.exports = function fetch(options, data) {
  return new Promise(function (resolve, reject) {
    const req = https.request(options, function (res) {
      let data = "";
      res.on("data", function (chunk) {
        data += chunk;
      });

      res.on("end", function () {
        let body = undefined;
        try {
          body = data ? JSON.parse(data) : undefined;
        } catch (e) {
          return reject(e);
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(body ? new Error(body.message) : res.statusMessage);
        }

        return resolve(body);
      });
    });

    req.on("error", function (err) {
      reject(err);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
};
