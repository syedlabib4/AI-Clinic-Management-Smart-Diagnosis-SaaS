const router = require("express").Router()
const ensureAuthenticated = require("../Middlewares/Auth")
const roleAuth = require("../Middlewares/roleAuth")
const { getAdminAnalytics, getDoctorAnalytics } = require("../Controllers/AnalyticsController")

router.get("/admin", ensureAuthenticated, roleAuth("admin"), getAdminAnalytics)
router.get("/doctor", ensureAuthenticated, roleAuth("doctor"), getDoctorAnalytics)

module.exports = router
