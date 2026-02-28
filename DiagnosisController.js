const DiagnosisLogModel = require("../Models/DiagnosisLog")

const createDiagnosis = async (req, res) => {
    try {
        const { patientId, symptoms, age, gender, medicalHistory, aiResponse, possibleConditions, riskLevel, suggestedTests } = req.body

        const diagnosis = new DiagnosisLogModel({
            patientId: patientId || null,
            doctorId: req.user._id,
            symptoms,
            age,
            gender,
            medicalHistory,
            aiResponse,
            possibleConditions: possibleConditions || [],
            riskLevel: riskLevel || "low",
            suggestedTests: suggestedTests || []
        })

        await diagnosis.save()

        res.status(201).json({
            message: "Diagnosis logged successfully",
            success: true,
            diagnosis
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getDiagnosesByPatient = async (req, res) => {
    try {
        const diagnoses = await DiagnosisLogModel.find({ patientId: req.params.patientId })
            .populate("doctorId", "name specialization")
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, diagnoses })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getDiagnosesByDoctor = async (req, res) => {
    try {
        const diagnoses = await DiagnosisLogModel.find({ doctorId: req.user._id })
            .populate("patientId", "name age gender")
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, diagnoses })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getAllDiagnoses = async (req, res) => {
    try {
        const diagnoses = await DiagnosisLogModel.find()
            .populate("doctorId", "name specialization")
            .populate("patientId", "name age gender")
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, diagnoses })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = { createDiagnosis, getDiagnosesByPatient, getDiagnosesByDoctor, getAllDiagnoses }
