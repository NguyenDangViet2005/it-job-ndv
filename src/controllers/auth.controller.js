const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Register Controller Error:", error);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password,
    );

    // Set Refresh Token in HttpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.app.env === "production",
      sameSite: "lax", // Lax is better for navigation from external sites/redirects
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken; // Get from Cookie

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const result = await authService.refreshToken(refreshToken);

    // Set new Refresh Token in HttpOnly Cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.app.env === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    res
      .status(401)
      .clearCookie("refreshToken")
      .json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
        await authService.logout(decoded.id);
      } catch (err) {
        // Token invalid, expired or verification failed
        // Proceed to clear cookie anyway
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.app.env === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
