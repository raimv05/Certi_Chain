const jwt = require("jsonwebtoken");

function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next({ statusCode: 401, message: "Authentication token missing" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return next({ statusCode: 401, message: "Invalid authentication token" });
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next({ statusCode: 403, message: "Insufficient permissions" });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
