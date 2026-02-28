const AppointmentModel = require("../Models/Appointment")

const createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, timeSlot, reason, notes } = req.body

        const appointment = new AppointmentModel({
            patientId, doctorId, date, timeSlot, reason, notes,
            createdBy: req.user._id
        })

        await appointment.save()

        res.status(201).json({
            message: "Appointment booked successfully",
            success: true,
            appointment
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getAllAppointments = async (req, res) => {
    try {
        const filter = {}
        if (req.query.doctorId) filter.doctorId = req.query.doctorId
        if (req.query.patientId) filter.patientId = req.query.patientId
        if (req.query.status) filter.status = req.query.status
        if (req.query.date) {
            const startDate = new Date(req.query.date)
            const endDate = new Date(req.query.date)
            endDate.setDate(endDate.getDate() + 1)
            filter.date = { $gte: startDate, $lt: endDate }
        }

        const appointments = await AppointmentModel.find(filter)
            .populate("patientId", "name age gender contact")
            .populate("doctorId", "name specialization")
            .sort({ date: -1 })

        res.status(200).json({ success: true, appointments })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getAppointmentById = async (req, res) => {
    try {
        const appointment = await AppointmentModel.findById(req.params.id)
            .populate("patientId", "name age gender contact")
            .populate("doctorId", "name specialization email")

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found", success: false })
        }

        res.status(200).json({ success: true, appointment })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const updateAppointment = async (req, res) => {
    try {
        const appointment = await AppointmentModel.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        ).populate("patientId", "name age gender contact")
            .populate("doctorId", "name specialization")

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found", success: false })
        }

        res.status(200).json({ message: "Appointment updated", success: true, appointment })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const appointment = await AppointmentModel.findByIdAndUpdate(
            req.params.id,
            { status: "cancelled" },
            { new: true }
        )

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found", success: false })
        }

        res.status(200).json({ message: "Appointment cancelled", success: true, appointment })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getDoctorSchedule = async (req, res) => {
    try {
        const doctorId = req.params.doctorId || req.user._id
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const appointments = await AppointmentModel.find({
            doctorId,
            date: { $gte: today },
            status: { $ne: "cancelled" }
        })
            .populate("patientId", "name age gender contact")
            .sort({ date: 1, timeSlot: 1 })

        res.status(200).json({ success: true, appointments })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = {
    createAppointment, getAllAppointments, getAppointmentById,
    updateAppointment, cancelAppointment, getDoctorSchedule
}
