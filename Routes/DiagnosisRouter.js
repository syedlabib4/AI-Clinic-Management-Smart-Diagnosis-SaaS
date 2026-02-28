const router = require("express").Router()
const ensureAuthenticated = require("../Middlewares/Auth")
const roleAuth = require("../Middlewares/roleAuth")
const {
    createDiagnosis, getDiagnosesByPatient,
    getDiagnosesByDoctor, getAllDiagnoses
} = require("../Controllers/DiagnosisController")

router.post("/", ensureAuthenticated, roleAuth("doctor"), createDiagnosis)
router.get("/", ensureAuthenticated, getAllDiagnoses)
router.get("/doctor", ensureAuthenticated, roleAuth("doctor"), getDiagnosesByDoctor)
router.get("/patient/:patientId", ensureAuthenticated, getDiagnosesByPatient)

module.exports = router
