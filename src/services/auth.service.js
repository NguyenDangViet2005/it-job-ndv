const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const env = require("../configs/env.config");
const LoginResponse = require("../dtos/LoginResponse.dto");

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ id: userId, role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn || "15m",
  });
  const refreshToken = jwt.sign({ id: userId, role }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn || "7d",
  });
  return { accessToken, refreshToken };
};

const register = async (userData) => {
  const { email, password, fullName, gender, dateOfBirth, phone } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    fullName,
    phone,
    role: "user",
    gender:
      gender && gender !== "" && gender !== "null" && gender !== "undefined"
        ? gender
        : null,
    dateOfBirth:
      dateOfBirth &&
      dateOfBirth !== "" &&
      dateOfBirth !== "null" &&
      dateOfBirth !== "undefined"
        ? dateOfBirth
        : null,
  });

  return newUser;
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  // Update refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  return new LoginResponse(accessToken, refreshToken, user);
};

const logout = async (userId) => {
  if (userId) {
    const user = await User.findByPk(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
};

const refreshTokenService = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    // Generate NEW Access Token ONLY (Keep existing Refresh Token)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      env.jwt.accessSecret,
      {
        expiresIn: env.jwt.accessExpiresIn || "15m",
      }
    );

    // Return current refresh token (do NOT rotate/update DB)
    return { accessToken, refreshToken, user };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken: refreshTokenService,
};
