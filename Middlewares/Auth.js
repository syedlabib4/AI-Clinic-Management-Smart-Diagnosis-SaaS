const jwt = require('jsonwebtoken')
const UserModel = require('../Models/users')

const ensureAuthenticated = async (req, res, next) => {
    const auth = req.headers['authorization']

    if (!auth) {
        return res.status(403).json({
            message: 'Unauthorized, JWT token is required',
            success: false
        })
    }

    try {
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findById(decoded._id).select('-password')
        if (!user) {
            return res.status(403).json({
                message: 'User not found',
                success: false
            })
        }
        req.user = user
        next()
    } catch (err) {
        return res.status(403).json({
            message: 'Unauthorized. JWT token wrong or expired',
            success: false
        })
    }
}

module.exports = ensureAuthenticated
