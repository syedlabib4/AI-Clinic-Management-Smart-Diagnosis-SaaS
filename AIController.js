const { GoogleGenerativeAI } = require("@google/generative-ai")

let genAI = null
try {
    if (process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    }
} catch (err) {
    console.log("Gemini AI initialization failed:", err.message)
}

const getAIModel = () => {
    if (!genAI) return null
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
}

// AI Feature 1 – Smart Symptom Checker
const symptomChecker = async (req, res) => {
    try {
        const { symptoms, age, gender, medicalHistory } = req.body

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ message: "Symptoms are required", success: false })
        }

        const model = getAIModel()
        if (!model) {
            return res.status(200).json({
                success: true,
                aiAvailable: false,
                message: "AI service not configured. Please add GEMINI_API_KEY to .env",
                fallbackResponse: {
                    possibleConditions: ["AI analysis unavailable - please consult a medical professional"],
                    riskLevel: "unknown",
                    suggestedTests: ["Complete blood count (CBC)", "Basic metabolic panel"],
                    recommendation: "Please consult with the doctor for a thorough examination."
                }
            })
        }

        const prompt = `You are a medical AI assistant. Based on the following patient information, provide a preliminary analysis. This is for a doctor's reference only, not a final diagnosis.

Patient Information:
- Symptoms: ${symptoms.join(", ")}
- Age: ${age || "Not specified"}
- Gender: ${gender || "Not specified"}
- Medical History: ${medicalHistory || "None provided"}

Please respond in the following JSON format only (no markdown, no code blocks):
{
  "possibleConditions": ["condition1", "condition2", "condition3"],
  "riskLevel": "low|medium|high|critical",
  "suggestedTests": ["test1", "test2"],
  "recommendation": "brief recommendation text",
  "reasoning": "brief reasoning for the assessment"
}`

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        let parsed
        try {
            const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            parsed = JSON.parse(cleaned)
        } catch {
            parsed = {
                possibleConditions: ["Analysis complete - see raw response"],
                riskLevel: "medium",
                suggestedTests: ["General check-up recommended"],
                recommendation: responseText,
                reasoning: ""
            }
        }

        res.status(200).json({
            success: true,
            aiAvailable: true,
            analysis: parsed
        })
    } catch (err) {
        console.log("AI Symptom Checker Error:", err)
        res.status(200).json({
            success: true,
            aiAvailable: false,
            message: "AI analysis failed. System continues normally.",
            fallbackResponse: {
                possibleConditions: ["AI temporarily unavailable"],
                riskLevel: "unknown",
                suggestedTests: ["Please proceed with standard examination"],
                recommendation: "AI service encountered an error. Please rely on clinical judgment."
            }
        })
    }
}

// AI Feature 2 – Prescription Explanation
const prescriptionExplanation = async (req, res) => {
    try {
        const { medicines, diagnosis, instructions } = req.body

        const model = getAIModel()
        if (!model) {
            return res.status(200).json({
                success: true,
                aiAvailable: false,
                message: "AI service not configured",
                explanation: "AI explanation not available. Please consult your doctor for details about your prescription."
            })
        }

        const medList = medicines.map(m => `${m.name} (${m.dosage}, ${m.frequency}, ${m.duration})`).join("; ")

        const prompt = `You are a friendly medical assistant explaining a prescription to a patient in simple, easy-to-understand language.

Prescription Details:
- Diagnosis: ${diagnosis || "Not specified"}
- Medicines: ${medList}
- Doctor's Instructions: ${instructions || "None"}

Please provide:
1. A simple explanation of each medicine and why it was prescribed
2. Important lifestyle recommendations
3. Preventive advice
4. Any general precautions

Keep the language simple and supportive. Respond in plain text paragraphs, not JSON.`

        const result = await model.generateContent(prompt)
        const explanation = result.response.text()

        res.status(200).json({
            success: true,
            aiAvailable: true,
            explanation
        })
    } catch (err) {
        console.log("AI Prescription Explanation Error:", err)
        res.status(200).json({
            success: true,
            aiAvailable: false,
            explanation: "AI explanation not available at the moment. Please consult your doctor for details."
        })
    }
}

// AI Feature 3 – Risk Flagging
const riskFlagging = async (req, res) => {
    try {
        const { patientHistory, currentSymptoms } = req.body

        const model = getAIModel()
        if (!model) {
            return res.status(200).json({
                success: true,
                aiAvailable: false,
                message: "AI service not configured",
                flags: []
            })
        }

        const prompt = `You are a medical AI that detects risk patterns. Analyze the following patient data and flag any concerns.

Patient History: ${JSON.stringify(patientHistory || [])}
Current Symptoms: ${(currentSymptoms || []).join(", ")}

Please respond in JSON format only (no markdown):
{
  "flags": [
    {
      "type": "repeated_infection|chronic_symptom|high_risk_combination|drug_interaction",
      "severity": "low|medium|high|critical",
      "description": "brief description",
      "recommendation": "what to do"
    }
  ],
  "overallRisk": "low|medium|high|critical",
  "summary": "brief summary of findings"
}`

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        let parsed
        try {
            const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            parsed = JSON.parse(cleaned)
        } catch {
            parsed = { flags: [], overallRisk: "unknown", summary: responseText }
        }

        res.status(200).json({
            success: true,
            aiAvailable: true,
            riskAnalysis: parsed
        })
    } catch (err) {
        console.log("AI Risk Flagging Error:", err)
        res.status(200).json({
            success: true,
            aiAvailable: false,
            flags: [],
            message: "AI risk analysis unavailable"
        })
    }
}

// AI Feature 4 – Predictive Analytics
const predictiveAnalytics = async (req, res) => {
    try {
        const { diagnosisData, appointmentData } = req.body

        const model = getAIModel()
        if (!model) {
            return res.status(200).json({
                success: true,
                aiAvailable: false,
                message: "AI service not configured",
                predictions: null
            })
        }

        const prompt = `You are a healthcare analytics AI. Based on the following clinic data, provide predictive insights.

Recent Diagnoses: ${JSON.stringify(diagnosisData || [])}
Appointment Trends: ${JSON.stringify(appointmentData || [])}

Please respond in JSON format only (no markdown):
{
  "commonDiseases": [{"name": "disease", "count": 0, "trend": "increasing|stable|decreasing"}],
  "patientLoadForecast": "brief forecast for next month",
  "recommendations": ["recommendation1", "recommendation2"],
  "seasonalAlerts": ["any seasonal health concerns"]
}`

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        let parsed
        try {
            const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            parsed = JSON.parse(cleaned)
        } catch {
            parsed = { commonDiseases: [], patientLoadForecast: responseText, recommendations: [], seasonalAlerts: [] }
        }

        res.status(200).json({
            success: true,
            aiAvailable: true,
            predictions: parsed
        })
    } catch (err) {
        console.log("AI Predictive Analytics Error:", err)
        res.status(200).json({
            success: true,
            aiAvailable: false,
            predictions: null,
            message: "AI predictive analytics unavailable"
        })
    }
}

module.exports = { symptomChecker, prescriptionExplanation, riskFlagging, predictiveAnalytics }
