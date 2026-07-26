const express = require("express");
const authController = require("../controllers/auth.controller");
const passport = require("../configs/passport.config");

const env = require("../configs/env.config");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshtoken);
router.post("/set-cookie", authController.setCookie);

const pendingAuths = new Map();

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/facebook/callback",
  async (req, res, next) => {
    const code = req.query.code;
    if (code) {
      if (pendingAuths.has(code)) {
        console.log(`[Duplicate Check] Waiting for original request of code: ${code}...`);
        try {
          const redirectUrl = await pendingAuths.get(code);
          if (!res.headersSent) {
            return res.redirect(redirectUrl);
          }
          return;
        } catch (err) {
          if (!res.headersSent) {
            return res.redirect(`${env.client.url}/dang-nhap?error=facebook_auth_failed`);
          }
          return;
        }
      }

      // Create a deferred promise for this code
      let resolveAuth;
      let rejectAuth;
      const authPromise = new Promise((resolve, reject) => {
        resolveAuth = resolve;
        rejectAuth = reject;
      });
      authPromise.catch(() => {}); // Prevent uncaught promise rejection crash
      pendingAuths.set(code, authPromise);

      // Clean up after 30 seconds
      setTimeout(() => {
        pendingAuths.delete(code);
      }, 30000);

      req.resolveAuth = resolveAuth;
      req.rejectAuth = rejectAuth;
    }

    passport.authenticate("facebook", { session: false }, (err, user, info) => {
      if (err) {
        console.error("Facebook Strategy Error:", err);
        const errorRedirect = `${env.client.url}/dang-nhap?error=facebook_auth_failed`;
        if (req.rejectAuth) req.rejectAuth(err);
        if (err.name === "FacebookTokenError" || (err.message && err.message.includes("used"))) {
          // If the authorization code is already used, redirect to client home
          return res.redirect(`${env.client.url}/`);
        }
        return res.redirect(errorRedirect);
      }
      if (!user) {
        const failedRedirect = `${env.client.url}/dang-nhap?error=facebook_failed`;
        if (req.rejectAuth) req.rejectAuth(new Error("User not found"));
        return res.redirect(failedRedirect);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.facebookCallback
);

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Route callback theo cấu hình trên Google Cloud Console (hoặc /api/auth/google/callback)
const handleGoogleAuthCallback = async (req, res, next) => {
  const code = req.query.code;
  if (code) {
    if (pendingAuths.has(code)) {
      console.log(`[Duplicate Check] Waiting for original request of code: ${code}...`);
      try {
        const redirectUrl = await pendingAuths.get(code);
        if (!res.headersSent) {
          return res.redirect(redirectUrl);
        }
        return;
      } catch (err) {
        if (!res.headersSent) {
          return res.redirect(`${env.client.url}/dang-nhap?error=google_auth_failed`);
        }
        return;
      }
    }

    let resolveAuth;
    let rejectAuth;
    const authPromise = new Promise((resolve, reject) => {
      resolveAuth = resolve;
      rejectAuth = reject;
    });
    authPromise.catch(() => {}); // Prevent uncaught promise rejection crash
    pendingAuths.set(code, authPromise);

    setTimeout(() => {
      pendingAuths.delete(code);
    }, 30000);

    req.resolveAuth = resolveAuth;
    req.rejectAuth = rejectAuth;
  }

  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Google Strategy Error:", err);
      if (req.rejectAuth) req.rejectAuth(err);
      if (
        err.name === "TokenError" ||
        err.code === "invalid_grant" ||
        (err.message && err.message.includes("used"))
      ) {
        // If code is already used (e.g. browser refresh or duplicate fetch), redirect smoothly
        return res.redirect(`${env.client.url}/dang-nhap?error=google_code_expired`);
      }
      const errorRedirect = `${env.client.url}/dang-nhap?error=google_auth_failed`;
      return res.redirect(errorRedirect);
    }
    if (!user) {
      const failedRedirect = `${env.client.url}/dang-nhap?error=google_failed`;
      if (req.rejectAuth) req.rejectAuth(new Error("User not found"));
      return res.redirect(failedRedirect);
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.get("/google/callback", handleGoogleAuthCallback, authController.googleCallback);

// Hỗ trợ thêm alias route khớp với cấu hình redirect URI trên Google Console của bạn
router.get("/callback/google", handleGoogleAuthCallback, authController.googleCallback);

module.exports = router;
