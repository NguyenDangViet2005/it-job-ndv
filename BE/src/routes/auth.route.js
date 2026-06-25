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

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/facebook/callback",
  (req, res, next) => {
    passport.authenticate("facebook", { session: false }, (err, user, info) => {
      if (err) {
        console.error("Facebook Strategy Error:", err);
        if (err.name === "FacebookTokenError" || (err.message && err.message.includes("used"))) {
          // If the authorization code is already used, it means another concurrent request succeeded.
          // Redirect to client URL where silent refresh will pick up the cookie.
          return res.redirect(`${env.client.url}/`);
        }
        return res.redirect(`${env.client.url}/login?error=facebook_auth_failed`);
      }
      if (!user) {
        return res.redirect(`${env.client.url}/login?error=facebook_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.facebookCallback
);

module.exports = router;
