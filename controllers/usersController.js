const Users= require('../models/UsersModel');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcrypt');
const Token= require('../models/TokenModel');
const RefreshToken= require('../models/RefreshTokenModel');





const generateAccessToken= (user)=>{


  return jwt.sign({userId: user._id, username: user.username}, process.env.JWT_SECRET)
}


const registerUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({ message: "Missing Username Or Password" });
  }

  const userExists = await Users.findOne({ username });

  if (userExists) {
    return res
      .status(400)
      .json({ message: "A user with that username already exists" });
  }

  //const hashedPwd = await bcrypt.hash(password, 10);

  const user = await Users.create({ username, password: password });

  if (user) {
    const accessToken = generateAccessToken(user);
    await Token.create({ token: accessToken, userId: user._id });
    return res.status(201).json({
      user,
      accessToken
    });
  } else {
    return res
      .status(500)
      .json({ message: "Sorry something went wrong, failed to create user" });
  }
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ username });
console.log(user)
  if (user && user._id) {
    console.log('Input password:', password);
    console.log('Hashed password in database:', user.password);
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Is password valid?', isValidPassword);
    if (isValidPassword) {
      // Generate tokens only if password is correct
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      // Check if the user already has a token in the database
      const existingToken = await Token.findOne({ userId: user._id });
      if (existingToken) {
        // Update the existing token
        existingToken.token = accessToken;
        await existingToken.save();
      } else {
        // Create a new token
        await Token.create({ token: accessToken, userId: user._id });
      }

      // Save the refresh token in the database
      await RefreshToken.create({ refreshToken: refreshToken, userId: user._id });
      return res.json({
        user,
        accessToken
      });
    } else {
      return res.status(401).json({ message: "Username or password is incorrect" });
    }
  } else {
    return res.status(401).json({ message: "Username or password is incorrect" });
  }
};

const logoutUser = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Extract the token from the request headers

  // Check if the access token is in the database
  const foundToken = await Token.findOne({ token });
  if (foundToken) {
    // If the access token is found, remove both the access token and refresh token from the database
    await foundToken.deleteOne();
    await RefreshToken.findOneAndDelete({ userId: foundToken.userId });
    res.status(200).json({ message: "User logged out successfully" });
  } else {
    // If the access token is not found, it means the user is already logged out
    res.status(401).json({ message: "User is not logged in" });
  }
};

 const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};



module.exports= {registerUser, loginUser, getAllUsers, logoutUser};