const express= require('express');
const router= express.Router();
const {registerUser, loginUser, getAllUsers, logoutUser}= require('../controllers/usersController');
const authenticateUsers = require('../auth/authenticateUsers');



router.post('/register', registerUser);
router.post('/login',loginUser);
router.post('/logout', logoutUser);
router.get('/', getAllUsers);





module.exports= router;