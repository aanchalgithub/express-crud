const express = require('express')
const {signup,login,verify_otp,resend_otp,forgotPassword,changePassword} = require('../Controller/UserController')



const router = express.Router()


router.post("/signup",signup)
router.post("/login",login)
router.post("/verify_Otp",verify_otp)
router.post("/resend_otp",resend_otp)
router.post("/forgotPassword",forgotPassword)
router.post("/changePassword",changePassword)



module.exports = router

