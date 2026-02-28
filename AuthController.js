const UserModel = require("../Models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists, please login",
        success: false
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const validRoles = ["admin", "doctor", "receptionist", "patient"]
    const userRole = validRoles.includes(role) ? role : "patient"

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: userRole
    })

    await newUser.save()

    res.status(201).json({
      message: "Signup successful ✅",
      success: true
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const errorMsg = "Auth failed, email or password is wrong"

    const existingUser = await UserModel.findOne({ email })

    if (!existingUser) {
      return res.status(403).json({
        message: errorMsg,
        success: false
      })
    }

    const isPassEqual = await bcrypt.compare(password, existingUser.password)

    if (!isPassEqual) {
      return res.status(403).json({
        message: errorMsg,
        success: false
      })
    }

    const jwtToken = jwt.sign(
      {
        email: existingUser.email,
        _id: existingUser._id,
        role: existingUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      message: "Login successful ✅",
      success: true,
      jwtToken,
      email,
      name: existingUser.name,
      role: existingUser.role,
      subscriptionPlan: existingUser.subscriptionPlan,
      userId: existingUser._id
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    })
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

module.exports = { signup, login, getProfile }