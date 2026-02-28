const roleAuth = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                message: 'Authentication required',
                success: false
            })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
                success: false
            })
        }

        next()
    }
}

module.exports = roleAuth
