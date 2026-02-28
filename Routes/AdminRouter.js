const router = require("express").Router()
const ensureAuthenticated = require("../Middlewares/Auth")
const roleAuth = require("../Middlewares/roleAuth")
const {
    getAllDoctors, getAllReceptionists, getAllUsers,
    createStaffUser, updateUser, deleteUser
} = require("../Controllers/AdminController")

router.get("/doctors", ensureAuthenticated, getAllDoctors)
router.get("/receptionists", ensureAuthenticated, roleAuth("admin"), getAllReceptionists)
router.get("/users", ensureAuthenticated, roleAuth("admin"), getAllUsers)
router.post("/staff", ensureAuthenticated, roleAuth("admin"), createStaffUser)
router.put("/users/:id", ensureAuthenticated, roleAuth("admin"), updateUser)
router.delete("/users/:id", ensureAuthenticated, roleAuth("admin"), deleteUser)

module.exports = router
