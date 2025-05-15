const express= require('express');
const refreshToken = require('../controllers/refreshTokenController');
const router= express.Router();


router.post('/token/refresh', refreshToken);



module.exports= router;