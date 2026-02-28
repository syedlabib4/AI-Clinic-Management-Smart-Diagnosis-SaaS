const UserModel = require("../Models/users")
const bcrypt = require("bcrypt")

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await UserModel.find({ role: "doctor" }).select("-password").sort({ createdAt: -1 })
        res.status(200).json({ success: true, doctors })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getAllReceptionists = async (req, res) => {
    try {
        const receptionists = await UserModel.find({ role: "receptionist" }).select("-password").sort({ createdAt: -1 })
        res.status(200).json({ success: true, receptionists })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const filter = {}
        if (req.query.role) filter.role = req.query.role
        const users = await UserModel.find(filter).select("-password").sort({ createdAt: -1 })
        res.status(200).json({ success: true, users })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const createStaffUser = async (req, res) => {
    try {
        const { name, email, password, role, specialization, phone } = req.body

        if (!["doctor", "receptionist"].includes(role)) {
            return res.status(400).json({ message: "Invalid role for staff creation", success: false })
        }

        const existing = await UserModel.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: "User with this email already exists", success: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new UserModel({
            name, email, password: hashedPassword, role,
            specialization: specialization || "",
            phone: phone || ""
        })

        await user.save()

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(201).json({ message: `${role} created successfully`, success: true, user: userResponse })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, email, specialization, phone, isActive, subscriptionPlan } = req.body
        const updateData = {}
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (specialization !== undefined) updateData.specialization = specialization
        if (phone !== undefined) updateData.phone = phone
        if (isActive !== undefined) updateData.isActive = isActive
        if (subscriptionPlan) updateData.subscriptionPlan = subscriptionPlan

        const user = await UserModel.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        res.status(200).json({ message: "User updated", success: true, user })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }
        res.status(200).json({ message: "User deleted", success: true })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = { getAllDoctors, getAllReceptionists, getAllUsers, createStaffUser, updateUser, deleteUser }
