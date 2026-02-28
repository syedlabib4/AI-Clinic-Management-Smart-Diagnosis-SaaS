const mongoose = require("mongoose")

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true }
}, { _id: false })

const PrescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patients",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointments",
        default: null
    },
    medicines: [MedicineSchema],
    diagnosis: {
        type: String,
        default: ""
    },
    instructions: {
        type: String,
        default: ""
    },
    aiExplanation: {
        type: String,
        default: ""
    }
}, { timestamps: true })

const PrescriptionModel = mongoose.model("prescriptions", PrescriptionSchema)

module.exports = PrescriptionModel
