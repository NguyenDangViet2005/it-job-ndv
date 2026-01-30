const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, SessionLogin } = require("../models");
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
  const userWithoutPassword = user?.toJSON();
  delete userWithoutPassword.password;

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  // Save session to SessionLogin table
  await SessionLogin.destroy({ where: { userId: user.id } }); // Remove old sessions
  await SessionLogin.create({
    userId: user.id,
    accessToken,
    refreshToken,
  });

  // Also update refreshToken in User table for backward compatibility
  user.refreshToken = refreshToken;
  await user.save();

  return new LoginResponse(accessToken, refreshToken, userWithoutPassword);
};

const logout = async (userId) => {
  if (userId) {
    // Delete session from SessionLogin
    await SessionLogin.destroy({ where: { userId } });

    // Also clear refreshToken in User table
    const user = await User.findByPk(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
};

const refreshTokenService = async (refreshToken) => {
  try {
    // Verify refreshToken
    const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);

    // Find session from database
    const session = await SessionLogin.findOne({
      where: { refreshToken },
    });

    if (!session) {
      throw new Error("Invalid refresh token - session not found");
    }

    // Get user info
    const user = await User.findByPk(session.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const userWithoutPassword = user?.toJSON();
    delete userWithoutPassword.password;

    // Check if current accessToken is still valid and has > 1 minute remaining
    let accessToken = session.accessToken;
    let shouldGenerateNewToken = true;

    try {
      const accessDecoded = jwt.verify(
        session.accessToken,
        env.jwt.accessSecret,
      );
      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = accessDecoded.exp - currentTime;

      // Only generate new token if less than 60 seconds remaining
      if (timeRemaining > 60) {
        shouldGenerateNewToken = false;
      }
    } catch (error) {
      // Token invalid or expired, generate new one
      shouldGenerateNewToken = true;
    }

    // Generate NEW Access Token ONLY if needed
    if (shouldGenerateNewToken) {
      accessToken = jwt.sign(
        { id: user.id, role: user.role },
        env.jwt.accessSecret,
        {
          expiresIn: env.jwt.accessExpiresIn || "15m",
        },
      );

      // Update accessToken in session
      session.accessToken = accessToken;
      session.updatedAt = new Date();
      await session.save();
    }

    // Return current refresh token (do NOT rotate/update DB)
    return new LoginResponse(accessToken, refreshToken, userWithoutPassword);
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
