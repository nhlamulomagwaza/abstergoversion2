const jwt = require("jsonwebtoken");

const RefreshToken = require("../models/RefreshTokenModel");
const Token = require("../models/TokenModel");
const Users = require("../models/UsersModel");

const refreshToken = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Bad request" });
  }

  const refreshToken = req.headers.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await Users.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const foundToken = await RefreshToken.findOne({
      refreshToken: refreshToken,
      userId: decoded.userId,
    });

    if (!foundToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2m" }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Update the TokenModel with the new accessToken
    const tokenDoc = await Token.findOne({ userId: user.id });
    if (tokenDoc) {
      tokenDoc.token = accessToken;
      await tokenDoc.save();
    } else {
      const newTokenDoc = new Token({ token: accessToken, userId: user.id });
      await newTokenDoc.save();
    }

    await RefreshToken.deleteOne({
      refreshToken: refreshToken,
      userId: decoded.userId,
    });
    const newRefreshTokenDoc = new RefreshToken({
      refreshToken: newRefreshToken,
      userId: user.id,
    });
    await newRefreshTokenDoc.save();

    return res.json({
      username: user.username,
      token: accessToken,
      newRefreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

module.exports = refreshToken;
