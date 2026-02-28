const router = require("express").Router()
const ensureAuthenticated = require("../Middlewares/Auth")
const roleAuth = require("../Middlewares/roleAuth")
const {
    createAppointment, getAllAppointments, getAppointmentById,
    updateAppointment, cancelAppointment, getDoctorSchedule
} = require("../Controllers/AppointmentController")

router.post("/", ensureAuthenticated, roleAuth("admin", "doctor", "receptionist"), createAppointment)
router.get("/", ensureAuthenticated, getAllAppointments)
router.get("/schedule", ensureAuthenticated, getDoctorSchedule)
router.get("/schedule/:doctorId", ensureAuthenticated, getDoctorSchedule)
router.get("/:id", ensureAuthenticated, getAppointmentById)
router.put("/:id", ensureAuthenticated, roleAuth("admin", "doctor", "receptionist"), updateAppointment)
router.put("/:id/cancel", ensureAuthenticated, cancelAppointment)

module.exports = router
