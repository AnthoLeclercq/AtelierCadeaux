const jwt = require("jsonwebtoken")
const secretKey = "the-super-strong-secret"
const bcrypt = require("bcryptjs");

const encryptPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

const comparePassword = (plainPassword, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const extractToken = (req) => {
  const token =
    req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  if (!token) {
    throw new Error("Authorization token missing");
  }

  return token;
};

const extractTokenInfo = (req) => {
  const token = extractToken(req);
  try {
    const decoded = jwt.verify(token, secretKey);
    const userRole = decoded.role;
    const userId = decoded.user_id;
    return { userRole, userId };
  } catch (error) {
    throw new Error(`Invalid token: ${token}`);
  }
};

const authentication = () => {
  return (req, res, next) => {
    try {
      const { userRole, userId } = extractTokenInfo(req);
      req.user = { user_id: userId, role: userRole };
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };
};

const authenticateAndCheckRole = (role) => {
  return (req, res, next) => {
    try {
      const { userRole, userId } = extractTokenInfo(req);

      if (role) {
        if (userRole !== role && userRole !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        const paramId = parseInt(req.params.id, 10);
        if (userId !== paramId && userRole !== "admin") {
          console.log(userId, req.params.id);
          return res.status(403).json({ message: "Access denied" });
        }
      }

      req.user = { user_id: userId, role: userRole };
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };
};

module.exports = {
  authentication,
  authenticateAndCheckRole,
  encryptPassword,
  comparePassword
}
