const UserModel = require("../Models/users")
const PatientModel = require("../Models/Patient")
const AppointmentModel = require("../Models/Appointment")
const PrescriptionModel = require("../Models/Prescription")
const DiagnosisLogModel = require("../Models/DiagnosisLog")

const getAdminAnalytics = async (req, res) => {
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        const [
            totalPatients, totalDoctors, totalReceptionists,
            totalAppointments, monthlyAppointments, lastMonthAppointments,
            totalPrescriptions, recentDiagnoses, appointmentsByStatus
        ] = await Promise.all([
            PatientModel.countDocuments(),
            UserModel.countDocuments({ role: "doctor" }),
            UserModel.countDocuments({ role: "receptionist" }),
            AppointmentModel.countDocuments(),
            AppointmentModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
            AppointmentModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
            PrescriptionModel.countDocuments(),
            DiagnosisLogModel.find().sort({ createdAt: -1 }).limit(50).select("possibleConditions riskLevel createdAt"),
            AppointmentModel.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ])
        ])

        // Compute common diagnoses
        const diagnosisCounts = {}
        recentDiagnoses.forEach(d => {
            (d.possibleConditions || []).forEach(c => {
                diagnosisCounts[c] = (diagnosisCounts[c] || 0) + 1
            })
        })
        const commonDiagnoses = Object.entries(diagnosisCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }))

        // Monthly appointment trend (last 6 months)
        const monthlyTrend = await AppointmentModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ])

        // Simulated revenue (based on completed appointments)
        const completedAppointments = await AppointmentModel.countDocuments({ status: "completed" })
        const simulatedRevenue = completedAppointments * 500

        res.status(200).json({
            success: true,
            analytics: {
                totalPatients,
                totalDoctors,
                totalReceptionists,
                totalAppointments,
                monthlyAppointments,
                lastMonthAppointments,
                totalPrescriptions,
                simulatedRevenue,
                commonDiagnoses,
                appointmentsByStatus,
                monthlyTrend
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getDoctorAnalytics = async (req, res) => {
    try {
        const doctorId = req.user._id
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const [dailyAppointments, monthlyAppointments, totalPrescriptions, totalDiagnoses, recentAppointments] = await Promise.all([
            AppointmentModel.countDocuments({ doctorId, date: { $gte: startOfDay }, status: { $ne: "cancelled" } }),
            AppointmentModel.countDocuments({ doctorId, createdAt: { $gte: startOfMonth } }),
            PrescriptionModel.countDocuments({ doctorId }),
            DiagnosisLogModel.countDocuments({ doctorId }),
            AppointmentModel.find({ doctorId })
                .populate("patientId", "name age gender")
                .sort({ date: -1 })
                .limit(10)
        ])

        res.status(200).json({
            success: true,
            analytics: {
                dailyAppointments,
                monthlyAppointments,
                totalPrescriptions,
                totalDiagnoses,
                recentAppointments
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = { getAdminAnalytics, getDoctorAnalytics }
