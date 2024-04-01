const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      //dolfeencabs-secret-key
      jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            
          return res.status(401).send({
            success: 0,
            message: "Invalid Auth Token"
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({
        success: 0,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};
