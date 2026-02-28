const planCheck = (requiredPlan) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                message: 'Authentication required',
                success: false
            })
        }

        const planHierarchy = { free: 0, pro: 1 }
        const userPlanLevel = planHierarchy[req.user.subscriptionPlan] || 0
        const requiredPlanLevel = planHierarchy[requiredPlan] || 0

        if (userPlanLevel < requiredPlanLevel) {
            return res.status(403).json({
                message: `This feature requires the ${requiredPlan} plan. Please upgrade.`,
                success: false,
                requiresUpgrade: true
            })
        }

        next()
    }
}

module.exports = planCheck
