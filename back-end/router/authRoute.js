const express = require('express')
const router  = express.Router()
const {login,register, logOut}= require('../controller/authController')

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logOut)

module.exports = router