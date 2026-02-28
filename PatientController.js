const PatientModel = require("../Models/Patient")
const AppointmentModel = require("../Models/Appointment")
const PrescriptionModel = require("../Models/Prescription")
const DiagnosisLogModel = require("../Models/DiagnosisLog")

const createPatient = async (req, res) => {
    try {
        const { name, age, gender, contact, email, address, bloodGroup, allergies } = req.body

        const patient = new PatientModel({
            name, age, gender, contact, email, address, bloodGroup, allergies,
            createdBy: req.user._id
        })

        await patient.save()

        res.status(201).json({
            message: "Patient registered successfully",
            success: true,
            patient
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getAllPatients = async (req, res) => {
    try {
        const patients = await PatientModel.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, patients })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getPatientById = async (req, res) => {
    try {
        const patient = await PatientModel.findById(req.params.id)
            .populate("createdBy", "name email")

        if (!patient) {
            return res.status(404).json({ message: "Patient not found", success: false })
        }

        res.status(200).json({ success: true, patient })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const updatePatient = async (req, res) => {
    try {
        const patient = await PatientModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!patient) {
            return res.status(404).json({ message: "Patient not found", success: false })
        }

        res.status(200).json({ message: "Patient updated", success: true, patient })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const deletePatient = async (req, res) => {
    try {
        const patient = await PatientModel.findByIdAndDelete(req.params.id)

        if (!patient) {
            return res.status(404).json({ message: "Patient not found", success: false })
        }

        res.status(200).json({ message: "Patient deleted", success: true })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getPatientHistory = async (req, res) => {
    try {
        const patientId = req.params.id

        const [appointments, prescriptions, diagnoses] = await Promise.all([
            AppointmentModel.find({ patientId })
                .populate("doctorId", "name specialization")
                .sort({ date: -1 }),
            PrescriptionModel.find({ patientId })
                .populate("doctorId", "name specialization")
                .sort({ createdAt: -1 }),
            DiagnosisLogModel.find({ patientId })
                .populate("doctorId", "name specialization")
                .sort({ createdAt: -1 })
        ])

        res.status(200).json({
            success: true,
            history: { appointments, prescriptions, diagnoses }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = {
    createPatient, getAllPatients, getPatientById,
    updatePatient, deletePatient, getPatientHistory
}
