const express = require("express");
const authController = require("../controllers/auth.controller");
const passport = require("../configs/passport.config");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshtoken);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login-fail" }),
  authController.facebookCallback
);

module.exports = router;
