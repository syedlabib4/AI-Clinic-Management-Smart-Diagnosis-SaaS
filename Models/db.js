const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")

const connectDB = async () => {
  const mongo_conn = process.env.MONGO_CONN

  try {
    // Attempt standard connection first
    console.log("Attempting to connect to external MongoDB...")
    await mongoose.connect(mongo_conn, {
      serverSelectionTimeoutMS: 5000 // Timeout quickly so we can fallback
    })
    console.log("MongoDB connection successful ✅")
  } catch (err) {
    console.log("External MongoDB connection failed ❌. Falling back to In-Memory DB...")
    try {
      // Fallback: Start an in-memory db
      const mongoServer = await MongoMemoryServer.create()
      const uri = mongoServer.getUri()
      await mongoose.connect(uri)
      console.log("In-Memory MongoDB connection successful ✅ (Data will reset on restart)")

      // Auto-seed demo accounts since it's a fresh DB
      await seedDemoAccounts()
    } catch (fallbackErr) {
      console.error("Critical error: Both external and in-memory DB connections failed.", fallbackErr)
      process.exit(1)
    }
  }
}

const seedDemoAccounts = async () => {
  try {
    const User = require('./users')
    const bcrypt = require('bcrypt') // Already in package.json from Auth model

    // Only seed if empty
    const count = await User.countDocuments()
    if (count > 0) return

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('1234', salt)

    console.log("🌱 Seeding Demo Accounts into In-Memory DB...")

    await User.create([
      {
        name: "Admin Demo",
        email: "admin@demo.com",
        password: hashedPassword,
        role: "admin",
        subscriptionPlan: "pro"
      },
      {
        name: "Doctor Demo",
        email: "doctor@demo.com",
        password: hashedPassword,
        role: "doctor",
        specialization: "General Physician",
        subscriptionPlan: "pro",
        contact: "555-0101"
      },
      {
        name: "Receptionist Demo",
        email: "reception@demo.com",
        password: hashedPassword,
        role: "receptionist"
      }
    ])
    console.log("✅ Demo accounts seeded successfully!")
    console.log("👉 Admin: admin@demo.com | Pass: 1234")
    console.log("👉 Doctor: doctor@demo.com | Pass: 1234")
  } catch (err) {
    console.error("Error seeding DB:", err)
  }
}

connectDB()