const router = require("express").Router()
const ensureAuthenticated = require("../Middlewares/Auth")
const roleAuth = require("../Middlewares/roleAuth")
const {
    createPatient, getAllPatients, getPatientById,
    updatePatient, deletePatient, getPatientHistory
} = require("../Controllers/PatientController")

router.post("/", ensureAuthenticated, roleAuth("admin", "doctor", "receptionist"), createPatient)
router.get("/", ensureAuthenticated, getAllPatients)
router.get("/:id", ensureAuthenticated, getPatientById)
router.put("/:id", ensureAuthenticated, roleAuth("admin", "doctor", "receptionist"), updatePatient)
router.delete("/:id", ensureAuthenticated, roleAuth("admin"), deletePatient)
router.get("/:id/history", ensureAuthenticated, getPatientHistory)

module.exports = router
