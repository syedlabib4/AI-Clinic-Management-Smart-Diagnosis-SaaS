const express = require("express")
require("dotenv").config()
require("./Models/db")
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
require('dns').setDefaultResultOrder('ipv4first');

const cors = require("cors")
const AuthRouter = require("./Routes/AuthRouter")
const PatientRouter = require("./Routes/PatientRouter")
const AppointmentRouter = require("./Routes/AppointmentRouter")
const PrescriptionRouter = require("./Routes/PrescriptionRouter")
const DiagnosisRouter = require("./Routes/DiagnosisRouter")
const AIRouter = require("./Routes/AIRouter")
const AdminRouter = require("./Routes/AdminRouter")
const AnalyticsRouter = require("./Routes/AnalyticsRouter")

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.use("/auth", AuthRouter)
app.use("/api/patients", PatientRouter)
app.use("/api/appointments", AppointmentRouter)
app.use("/api/prescriptions", PrescriptionRouter)
app.use("/api/diagnoses", DiagnosisRouter)
app.use("/api/ai", AIRouter)
app.use("/api/admin", AdminRouter)
app.use("/api/analytics", AnalyticsRouter)

app.get("/", (req, res) => {
  res.send("MediCare AI Clinic Server 🏥🚀")
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})