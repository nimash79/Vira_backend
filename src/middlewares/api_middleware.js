const jwt = require('jsonwebtoken');
const { SYSTEM_TOKEN } = require('../utils/constants');

const apiMiddleWare = (req, res, next) => {
  if (req.method == "OPTIONS") return res.send("eeeeeeeeee");
  res.sendResponse = (data, code = 200) => {
    res.send({
      code,
      error: null,
      data,
    });
  };
  res.sendError = (error, code = 500) => {
    console.log(error);
    if (typeof error == "object" && !isCyclic(error))
      error = JSON.stringify(error);
    error = error == undefined || error == null ? "undefined" : error;
    error = error.toString();
    res.send({
      code: code,
      error: error,
      data: undefined,
    });
  };
  next();
};

const userMiddleWare = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendError('unauthorized', 401);
  const data = jwt.decode(token);
  req.user = data;
  next();
};

const hardwareMiddleWare = async (req, res, next) => {
  const systemToken = req.headers['system-token'];
  if (!systemToken) return res.sendError('unauthorized', 401);
  if (systemToken !== SYSTEM_TOKEN) return res.sendError("the system token is invalid", 403);
  next();
}

function isCyclic(obj) {
  var seenObjects = [];

  function detect(obj) {
    if (obj && typeof obj === "object") {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          console.log(obj, "cycle at " + key);
          return true;
        }
      }
    }
    return false;
  }

  return detect(obj);
}

module.exports = { apiMiddleWare, userMiddleWare, hardwareMiddleWare };
