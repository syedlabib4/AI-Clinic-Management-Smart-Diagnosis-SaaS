const router = require("express").Router()

const { signup, login, getProfile } = require("../Controllers/AuthController")
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation")
const ensureAuthenticated = require("../Middlewares/Auth")

router.post("/signup", signupValidation, signup)
router.post("/login", loginValidation, login)
router.get("/profile", ensureAuthenticated, getProfile)

module.exports = router