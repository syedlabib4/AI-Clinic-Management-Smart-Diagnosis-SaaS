const PrescriptionModel = require("../Models/Prescription")

const createPrescription = async (req, res) => {
    try {
        const { patientId, appointmentId, medicines, diagnosis, instructions, aiExplanation } = req.body

        const prescription = new PrescriptionModel({
            patientId,
            doctorId: req.user._id,
            appointmentId: appointmentId || null,
            medicines,
            diagnosis,
            instructions,
            aiExplanation: aiExplanation || ""
        })

        await prescription.save()

        res.status(201).json({
            message: "Prescription created successfully",
            success: true,
            prescription
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getPrescriptionsByPatient = async (req, res) => {
    try {
        const prescriptions = await PrescriptionModel.find({ patientId: req.params.patientId })
            .populate("doctorId", "name specialization")
            .populate("patientId", "name age gender")
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, prescriptions })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getPrescriptionsByDoctor = async (req, res) => {
    try {
        const doctorId = req.user._id
        const prescriptions = await PrescriptionModel.find({ doctorId })
            .populate("patientId", "name age gender")
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, prescriptions })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getPrescriptionById = async (req, res) => {
    try {
        const prescription = await PrescriptionModel.findById(req.params.id)
            .populate("doctorId", "name specialization email phone")
            .populate("patientId", "name age gender contact address bloodGroup")

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found", success: false })
        }

        res.status(200).json({ success: true, prescription })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await PrescriptionModel.find()
            .populate("doctorId", "name specialization")
            .populate("patientId", "name age gender")
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, prescriptions })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = {
    createPrescription, getPrescriptionsByPatient,
    getPrescriptionsByDoctor, getPrescriptionById, getAllPrescriptions
}
