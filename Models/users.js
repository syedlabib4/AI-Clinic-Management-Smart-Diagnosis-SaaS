const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "receptionist", "patient"],
    default: "patient"
  },
  subscriptionPlan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  },
  specialization: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel