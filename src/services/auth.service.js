const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, SessionLogin } = require("../models");
const env = require("../configs/env.config");
const LoginResponse = require("../dtos/LoginResponse.dto");

const generateTokens = (userid, role) => {
  const accesstoken = jwt.sign({ id: userid, role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn || "15m",
  });
  const refreshtoken = jwt.sign({ id: userid, role }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn || "7d",
  });
  return { accesstoken, refreshtoken };
};

const register = async (userData) => {
  const { email, password, fullname, gender, dateofbirth, phone } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    fullname,
    phone,
    role: "user",
    gender:
      gender && gender !== "" && gender !== "null" && gender !== "undefined"
        ? gender
        : null,
    dateofbirth:
      dateofbirth &&
      dateofbirth !== "" &&
      dateofbirth !== "null" &&
      dateofbirth !== "undefined"
        ? dateofbirth
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

  const { accesstoken, refreshtoken } = generateTokens(user.id, user.role);

  // Save session to SessionLogin table
  await SessionLogin.destroy({ where: { userid: user.id } }); // Remove old sessions
  await SessionLogin.create({
    userid: user.id,
    accesstoken,
    refreshtoken,
  });

  // Also update refreshtoken in User table for backward compatibility
  user.refreshtoken = refreshtoken;
  await user.save();

  return new LoginResponse(accesstoken, refreshtoken, userWithoutPassword);
};

const logout = async (userid) => {
  if (userid) {
    // Delete session from SessionLogin
    await SessionLogin.destroy({ where: { userid } });

    // Also clear refreshtoken in User table
    const user = await User.findByPk(userid);
    if (user) {
      user.refreshtoken = null;
      await user.save();
    }
  }
};

const refreshtokenService = async (refreshtoken) => {
  try {
    // Verify refreshtoken
    const decoded = jwt.verify(refreshtoken, env.jwt.refreshSecret);

    // Find session from database
    const session = await SessionLogin.findOne({
      where: { refreshtoken },
    });

    if (!session) {
      throw new Error("Invalid refresh token - session not found");
    }

    // Get user info
    const user = await User.findByPk(session.userid);
    if (!user) {
      throw new Error("User not found");
    }

    const userWithoutPassword = user?.toJSON();
    delete userWithoutPassword.password;
    delete userWithoutPassword.refreshtoken;

    // Check if current accesstoken is still valid and has > 1 minute remaining
    let accesstoken = session.accesstoken;
    let shouldGenerateNewToken = true;

    try {
      const accessDecoded = jwt.verify(
        session.accesstoken,
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
      accesstoken = jwt.sign(
        { id: user.id, role: user.role },
        env.jwt.accessSecret,
        {
          expiresIn: env.jwt.accessExpiresIn || "15m",
        },
      );

      // Update accesstoken in session
      session.accesstoken = accesstoken;
      session.updatedat = new Date();
      await session.save();
    }

    // Return current refresh token (do NOT rotate/update DB)
    return new LoginResponse(accesstoken, refreshtoken, userWithoutPassword);
  } catch (error) {
    console.error("Refresh token error:", error.message);
    throw new Error("Invalid refresh token");
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshtoken: refreshtokenService,
};
