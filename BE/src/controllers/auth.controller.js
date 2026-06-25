const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const isProduction =
  env.app.env === "production" ||
  process.env.NODE_ENV === "production" ||
  (env.client.url && !env.client.url.includes("localhost"));

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
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
    const { accesstoken, refreshtoken, user } = await authService.login(
      email,
      password,
    );

    // Set Refresh Token in HttpOnly Cookie
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accesstoken,
        user,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const refreshtoken = async (req, res) => {
  try {
    const refreshtoken = req.cookies?.refreshtoken;

    if (!refreshtoken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const result = await authService.refreshtoken(refreshtoken);

    // Set new Refresh Token in HttpOnly Cookie
    res.cookie("refreshtoken", result.refreshtoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accesstoken: result.accesstoken,
        user: result.user,
      },
    });
  } catch (error) {
    console.error("Refresh token controller error:", error.message);
    res
      .status(401)
      .clearCookie("refreshtoken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .json({
        success: false,
        message: error.message || "Invalid refresh token",
      });
  }
};

const logout = async (req, res) => {
  try {
    const refreshtoken = req.cookies?.refreshtoken;

    if (refreshtoken) {
      try {
        const decoded = jwt.verify(refreshtoken, env.jwt.refreshSecret);
        await authService.logout(decoded.id);
      } catch (err) {
        // Token invalid, expired or verification failed
        // Proceed to clear cookie anyway
      }
    }

    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const facebookCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      const failedRedirect = `${env.client.url}/login?error=facebook_failed`;
      if (req.rejectAuth) req.rejectAuth(new Error("User not found"));
      return res.redirect(failedRedirect);
    }

    const { accesstoken, refreshtoken } = await authService.loginWithFacebook(user);

    // Set Refresh Token in HttpOnly Cookie
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend callback route with token and refreshtoken
    const successRedirect = `${env.client.url}/callback?token=${accesstoken}&refreshtoken=${refreshtoken}`;
    if (req.resolveAuth) {
      req.resolveAuth(successRedirect);
    }
    res.redirect(successRedirect);
  } catch (error) {
    console.error("Facebook Login Error:", error);
    const errorRedirect = `${env.client.url}/login?error=facebook_error`;
    if (req.rejectAuth) req.rejectAuth(error);
    res.redirect(errorRedirect);
  }
};

const setCookie = async (req, res) => {
  try {
    const { refreshtoken } = req.body;
    if (!refreshtoken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, message: "Cookie set successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshtoken,
  facebookCallback,
  setCookie,
};
