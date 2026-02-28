const router = require("express").Router()
const ensureAuthenticated = require("../Middlewares/Auth")
const roleAuth = require("../Middlewares/roleAuth")
const {
    createPrescription, getPrescriptionsByPatient,
    getPrescriptionsByDoctor, getPrescriptionById, getAllPrescriptions
} = require("../Controllers/PrescriptionController")

router.post("/", ensureAuthenticated, roleAuth("doctor"), createPrescription)
router.get("/", ensureAuthenticated, getAllPrescriptions)
router.get("/doctor", ensureAuthenticated, roleAuth("doctor"), getPrescriptionsByDoctor)
router.get("/patient/:patientId", ensureAuthenticated, getPrescriptionsByPatient)
router.get("/:id", ensureAuthenticated, getPrescriptionById)

module.exports = router
