module.exports = function (roles) {
  return (req, res, next) => {
    // Standardize to lowercase for comparison
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden: ${req.user.role} role does not have access.`
      });
    }
    next();
  };
};