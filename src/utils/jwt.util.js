const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

const generateAccessToken = (user) => {
  return generateToken(
    { id: user.id, role: user.role },
    env.jwt.accessSecret,
    env.jwt.accessExpiresIn
  );
};

const generateRefreshToken = (user) => {
  return generateToken(
    { id: user.id },
    env.jwt.refreshSecret,
    env.jwt.refreshExpiresIn
  );
};

module.exports = {
  generateToken,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
};
