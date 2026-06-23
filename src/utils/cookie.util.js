const env = require("../configs/env.config");

const setCookie = (res, name, value, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: env.app.env === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res.cookie(name, value, { ...defaultOptions, ...options });
};

const clearCookie = (res, name) => {
  res.clearCookie(name);
};

module.exports = {
  setCookie,
  clearCookie,
};
