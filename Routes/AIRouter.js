const router = require("express").Router()
const ensureAuthenticated = require("../Middlewares/Auth")
const roleAuth = require("../Middlewares/roleAuth")
const planCheck = require("../Middlewares/planCheck")
const {
    symptomChecker, prescriptionExplanation,
    riskFlagging, predictiveAnalytics
} = require("../Controllers/AIController")

router.post("/symptom-checker", ensureAuthenticated, roleAuth("doctor"), symptomChecker)
router.post("/prescription-explanation", ensureAuthenticated, prescriptionExplanation)
router.post("/risk-flagging", ensureAuthenticated, roleAuth("doctor"), riskFlagging)
router.post("/predictive-analytics", ensureAuthenticated, roleAuth("admin", "doctor"), predictiveAnalytics)

module.exports = router
