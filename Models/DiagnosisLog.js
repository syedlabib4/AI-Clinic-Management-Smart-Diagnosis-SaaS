const mongoose = require("mongoose")

const DiagnosisLogSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patients",
        default: null
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    symptoms: [{
        type: String
    }],
    age: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        default: ""
    },
    medicalHistory: {
        type: String,
        default: ""
    },
    aiResponse: {
        type: String,
        default: ""
    },
    possibleConditions: [{
        type: String
    }],
    riskLevel: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "low"
    },
    suggestedTests: [{
        type: String
    }]
}, { timestamps: true })

const DiagnosisLogModel = mongoose.model("diagnosislogs", DiagnosisLogSchema)

module.exports = DiagnosisLogModel
