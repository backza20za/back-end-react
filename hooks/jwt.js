const jwt = require("jsonwebtoken");
const constants = require("../hooks/constant");
var secret_key = "12344321";

module.exports = {
  sign: (payload) => {
    return jwt.sign(payload, secret_key);
  },
  verify: (req, res, next) => {
    var token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    if (!token)
      return res.status(403).json({
        status: constants.kResultNok,
        response: "Relogin Failed",
        token: "",
        username: "",
        message: "ไม่พบ token",
      });
    // .json({ auth: false, message: "No token provided." });
    //  status: constants.kResultOk,
    //   response: "re login success",
    //   token,
    //   username,
    //   message: "เข้าสู่ระบบสำเร็จ",

    jwt.verify(token, secret_key, function (err, decoded) {
      if (err) {
        if (err.name == "TokenExpiredError") {
          return res.status(401).json({
            status: constants.kResultNok,
            response: "Relogin Failed",
            token: "",
            username: "",
            message: "token ไม่ถูกต้อง",
          });
          // .json({ auth: false, message: "token expired" });
        } else {
          return res.status(500).json({
            status: constants.kResultNok,
            response: "Relogin Failed",
            token: "",
            username: "",
            message: "เกิดข้อผิดพลาด",
          });
        }
      }

      // if everything good, save to request for use in other routes
      req.username = decoded.username;
      next();
    });
  },
};
