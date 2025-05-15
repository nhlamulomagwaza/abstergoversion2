const jwt = require("jsonwebtoken");
const Token = require("../models/TokenModel"); // Importing the Token model

const authenticateUsers = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Checking if the token exists in the database
    const foundToken = await Token.findOne({ token });

    if (foundToken) {
      req.user = { id: decoded.userId, username: decoded.username };

      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateUsers;
